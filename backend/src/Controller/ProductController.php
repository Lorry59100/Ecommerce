<?php

namespace App\Controller;

use App\Repository\ProductsRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProductController extends AbstractController
{
    #[Route('/product', name: 'app_product')]
    public function index(): Response
    {
        return $this->render('product/index.html.twig', [
            'controller_name' => 'ProductController',
        ]);
    }

     /**
     * @Route("/api/products", name="product_list", methods={"GET"})
     */
    public function list(ProductsRepository $productRepository): JsonResponse
    {
        $products = $productRepository->findAll();
        
        // Vous pouvez formater les données comme vous le souhaitez
        $formattedProducts = [];
        foreach ($products as $product) {
            $formattedProducts[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'stock' => $product->getStock(),
                'img' => $product->getImg(),
                'description' => $product->getDescription(),
                // ... autres propriétés
            ];
        }

        return new JsonResponse($formattedProducts);
    }

     /**
     * @Route("/api/single_product/{id}", name="single_product", methods={"GET"})
     */
    public function show(ProductsRepository $productRepository, $id): JsonResponse
    {
        // Utilisez $id pour récupérer le produit correspondant dans la base de données
        $product = $productRepository->find($id);

        if (!$product) {
            // Gérez le cas où le produit n'est pas trouvé (par exemple, renvoyez une erreur 404)
            throw $this->createNotFoundException('Le produit n\'existe pas');
        }
        
        // Formatez les données du produit
        $formattedProduct = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
            'description' => $product->getDescription(),
            // ... autres propriétés
        ];

        return new JsonResponse($formattedProduct);
    }
}
