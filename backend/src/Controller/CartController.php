<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Repository\CartRepository;
use App\Repository\UserRepository;
use App\Repository\ProductsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CartController extends AbstractController
{
    #[Route('/cart', name: 'app_cart')]
    public function index(): Response
    {
        return $this->render('cart/index.html.twig', [
            'controller_name' => 'CartController',
        ]);
    }

 /**
 * @Route("/api/cart/{id}", name="show_cart", methods={"GET"})
 */
public function showCart(UserRepository $userRepository, CartRepository $cartRepository, $id): JsonResponse
{
    /* Récupérer l'utilisateur en fonction de son ID */
    $user = $userRepository->find($id);

    if (!$user) {
        // Gérez le cas où l'utilisateur n'est pas trouvé (par exemple, renvoyez une erreur 404)
        throw $this->createNotFoundException('Utilisateur inconnu');
    }

    /* Récupérer le panier en fonction de l'utilisateur */
    $carts = $cartRepository->findBy(['Owner' => $user, 'status' => null]);

    // Initialiser un tableau pour stocker les informations produit-quantité-prix-description-catégorie
    $productInfo = [];

    foreach ($carts as $cart) {
        // Accédez au produit associé à ce panier
        $product = $cart->getProduct();

        // Accédez aux informations du produit
        $productName = $product->getName();
        $img = $product->getImg();
        $quantity = $cart->getQuantity();
        $price = $product->getPrice();
        $description = $product->getDescription(); 
        $category = $product->getCategory();
        $id = $product->getId();

        // Stockez les informations dans le tableau associatif
        $productInfo[] = [
            'name' => $productName,
            'img' => $img,
            'id' => $id,
            'quantity' => $quantity,
            'price' => $price,
            'description' => $description,
            'category' => $category,
        ];
    }

    return new JsonResponse($productInfo);
}

/**
 * @Route("/api/addcart/{idUser}/{idProduct}/{quantity}", name="add_cart", methods={"POST"})
 */
public function addToCart(UserRepository $userRepository, ProductsRepository $productsRepository, CartRepository $cartRepository, EntityManagerInterface $entityManager,
$idUser, $idProduct, $quantity): JsonResponse | Response {
    
    // Récupérer l'utilisateur
    $user = $userRepository->find($idUser);
    if (!$user) {
        throw $this->createNotFoundException('Utilisateur inconnu');
    }

    // Récupérer le produit
    $product = $productsRepository->find($idProduct);
    if (!$product) {
        throw $this->createNotFoundException('Produit introuvable');
    }
   
    $carts = $cartRepository->findBy(['Owner' => $user, 'status' => null]);
    $productExistsInCart = false;

    foreach ($carts as $cart) {
    
        // Accédez au produit associé à ce panier
        $cartProduct = $cart->getProduct();
        // Vérifiez si le produit dans le panier correspond à celui que l'on souhaite ajouter
        if ($cartProduct->getId() == $idProduct) {
            // Récupérer la quantité existante en BDD
            $existingQuantity = $cart->getQuantity();
            // Mettre à jour cette quantité et persister les donées
            $cart->setQuantity($existingQuantity + $quantity);
            $entityManager->flush();
            $productExistsInCart = true;
            return new Response('Panier mis à jour', 201);
        }
    }
        // Si le produit n'existe pas encore dans le panier on l'ajoute
        if (!$productExistsInCart) {
            // Récupérez le produit correspondant à l'ID que l'on souhaite ajouter
            $productToAdd = $productsRepository->find($idProduct);
            if (!$productToAdd) {
                throw $this->createNotFoundException('Produit introuvable');
            }
            // Créez un nouvel élément de panier
            $newCartItem = new Cart();
            $newCartItem->setProduct($productToAdd);
            $newCartItem->setOwner($user);
            $newCartItem->setQuantity($quantity);
            $entityManager->persist($newCartItem);
            $entityManager->flush();
            return new Response('Produit ajouté au panier', 201);
        }

}

/**
 * @Route("/api/order/{idUser}", name="order", methods={"GET", "POST"})
 */
public function order(UserRepository $userRepository, CartRepository $cartRepository, EntityManagerInterface $entityManager,
$idUser): JsonResponse | Response {
    
    // Récupérer l'utilisateur
    $user = $userRepository->find($idUser);
    if (!$user) {
        throw $this->createNotFoundException('Utilisateur inconnu');
    }

    // Récupérer les produits
    $carts = $cartRepository->findBy(['Owner' => $user, 'status' => null]);

    foreach($carts as $cart) {
        $product = $cart->getProduct();
        // Accédez aux informations du produit
        $productName = $product->getName();
        $quantity = $cart->getQuantity();
        $price = $product->getPrice();
        $description = $product->getDescription(); 
        $category = $product->getCategory();

        // Stockez les informations dans le tableau associatif
        $productInfo[] = [
            'name' => $productName,
            'quantity' => $quantity,
            'price' => $price,
            'description' => $description,
            'category' => $category,
        ];
    }
    return new JsonResponse($productInfo);
}


/**
 * @Route("/api/confirm/{idUser}/{date}", name="confirm", methods={"GET", "POST"})
 */
public function confirm(UserRepository $userRepository, CartRepository $cartRepository, EntityManagerInterface $entityManager, $idUser, $date): JsonResponse
{
    // Récupérer l'utilisateur
    $user = $userRepository->find($idUser);
    if (!$user) {
        throw $this->createNotFoundException('Utilisateur inconnu');
    }

    // Convertissez la date au format souhaité
    $parsedDate = new \DateTime($date);

    // Générer un identifiant unique
    $orderNumber = uniqid();

    // Récupérer les produits
    $carts = $cartRepository->findBy(['Owner' => $user, 'status' => null]);
    $cartInfo = [];
    foreach($carts as $cart) {
        $productStatus = $cart->setStatus(1);
        $numberOrder = $cart->setOrdernumber($orderNumber);
        $deliveryDate = $cart->setDeliverydate($parsedDate);
        $entityManager->persist($cart);
        $entityManager->flush();
        $productStatus = $cart->getStatus();
        $numberOrder = $cart->getOrdernumber();
        $deliveryDate = $cart->getDeliverydate();

        // Stockez les informations dans le tableau associatif
        $cartInfo[] = [
            'status' => $productStatus,
            'numberOrder' => $numberOrder,
            'deliveryDate' => $deliveryDate
        ];
    }
    

    // Répondre avec un message de confirmation
    return new JsonResponse($cartInfo);
}

/**
 * @Route("/api/remove/{idUser}/{idProduct}", name="remove", methods={"POST"})
 */
public function removeOrder(UserRepository $userRepository, CartRepository $cartRepository, EntityManagerInterface $entityManager, $idUser, $idProduct): JsonResponse
{
    // Récupérer l'utilisateur
    $user = $userRepository->find($idUser);
    if (!$user) {
        throw $this->createNotFoundException('Utilisateur inconnu');
    }

    // Récupérer les produits
    $cart = $cartRepository->findOneBy(['Owner' => $user, 'status' => null, 'product' => $idProduct]);
    $entityManager->remove($cart);
    $entityManager->flush();
    
    // Répondre avec un message de confirmation
    return new JsonResponse('Produit supprimé du panier !');
}

/**
 * @Route("/api/shipping/{idUser}", name="shipping", methods={"GET"})
 */
public function isShipping(UserRepository $userRepository, CartRepository $cartRepository, $idUser): JsonResponse
{
    // Récupérer l'utilisateur
    $user = $userRepository->find($idUser);
    if (!$user) {
        throw $this->createNotFoundException('Utilisateur inconnu');
    }

    // Récupérer les produits
    $carts = $cartRepository->findBy(['Owner' => $user, 'status' => 1]);
    $productInfo = [];
    foreach($carts as $cart) {
        $product = $cart->getProduct();
        // Accédez aux informations du produit
        $productName = $product->getName();
        $quantity = $cart->getQuantity();
        $price = $product->getPrice();
        $description = $product->getDescription(); 
        $category = $product->getCategory();
        $orderNumber = $cart->getOrdernumber();
        $id = $cart->getId();
        $deliveryDate = $cart->getDeliverydate();

        // Stockez les informations dans le tableau associatif
        $productInfo[] = [
            'name' => $productName,
            'quantity' => $quantity,
            'price' => $price,
            'description' => $description,
            'category' => $category,
            'orderNumber' => $orderNumber,
            'deliveryDate' => $deliveryDate,
            'id' => $id,
        ];
    }
    // Répondre avec un message de confirmation
    return new JsonResponse($productInfo);
    }

/**
 * @Route("/api/delivered/{idUser}", name="delivered", methods={"GET"})
 */
public function delivered(UserRepository $userRepository, CartRepository $cartRepository, $idUser): JsonResponse
{
    // Récupérer l'utilisateur
    $user = $userRepository->find($idUser);
    if (!$user) {
        throw $this->createNotFoundException('Utilisateur inconnu');
    }

    // Récupérer les produits
    $carts = $cartRepository->findBy(['Owner' => $user, 'status' => 2]);
    $productInfo = [];
    foreach($carts as $cart) {
        $product = $cart->getProduct();
        // Accédez aux informations du produit
        $productName = $product->getName();
        $quantity = $cart->getQuantity();
        $price = $product->getPrice();
        $description = $product->getDescription(); 
        $category = $product->getCategory();
        $orderNumber = $cart->getOrdernumber();
        $id = $cart->getId();
        $deliveryDate = $cart->getDeliverydate();

        // Stockez les informations dans le tableau associatif
        $productInfo[] = [
            'name' => $productName,
            'quantity' => $quantity,
            'price' => $price,
            'description' => $description,
            'category' => $category,
            'orderNumber' => $orderNumber,
            'deliveryDate' => $deliveryDate,
            'id' => $id,
        ];
    }
    // Répondre avec un message de confirmation
    return new JsonResponse($productInfo);
    }
    
}

