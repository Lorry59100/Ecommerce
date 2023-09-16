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
                'description' => $product->getDescription(),
                // ... autres propriétés
            ];
        }

        return new JsonResponse($formattedProducts);
    }
}
