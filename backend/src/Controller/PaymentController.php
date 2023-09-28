<?php

namespace App\Controller;

use DateTime;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Doctrine\ORM\EntityManager;
use App\Repository\CartRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PaymentController extends AbstractController
{
    #[Route('/payment', name: 'app_payment')]
    public function index(): Response
    {
        return $this->render('payment/index.html.twig', [
            'controller_name' => 'PaymentController',
        ]);
    }

     /**
     * @Route("/api/orderPayment/{idUser}/{date}", name="order_payment", methods={"POST"})
     */
    public function payment(Request $request, UserRepository $userRepository, CartRepository $cartRepository, EntityManagerInterface $entityManager, $idUser, $date): JsonResponse | Response
    {
        // Récupérez le montant total depuis le corps de la requête POST
        $data = json_decode($request->getContent(), true);
        $amountToPay = $data['amountToPay'] ?? 0;
        $date = $data['selectedDate'] ?? null;

        $stripeSecretKey = $_ENV['STRIPE_SK'];

        // Configurez votre clé secrète Stripe
        Stripe::setApiKey($stripeSecretKey);

        // Créez une intention de paiement (PaymentIntent)
        $paymentIntent = PaymentIntent::create([
            'amount' => $amountToPay, // Montant en centimes
            'currency' => 'eur', // Devise
        ]);

        // Récupérez le clientSecret de l'intention de paiement
        $clientSecret = $paymentIntent->client_secret;

        // Récupérer l'utilisateur
        $user = $userRepository->find($idUser);
        if (!$user) {
            throw $this->createNotFoundException('Utilisateur inconnu');
        }

        // Convertissez la date au format souhaité
        $parsedDate = new DateTime($date);

        // Générer un identifiant unique
        $orderNumber = uniqid();

        // Récupérer les produits
        $carts = $cartRepository->findBy(['Owner' => $user, 'status' => null]);
        $cartInfo = [];
        foreach($carts as $cart) {
            $product = $cart->getProduct();
            $category = $product->getCategory()->getName();
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
                'deliveryDate' => $deliveryDate,
                'category' => $category
            ];
    }

        // Envoyez le clientSecret au client (par exemple, en tant que réponse JSON)
        return new JsonResponse(['clientSecret' => $clientSecret, 'amountToPay' => $amountToPay, 'cartInfo' => $cartInfo]);

    }
}
