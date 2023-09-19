<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LoginController extends AbstractController
{
    #[Route('/login', name: 'app_login')]
    public function index(): Response
    {
        return $this->render('login/index.html.twig', [
            'controller_name' => 'LoginController',
        ]);
    }

    /**
     * @Route("/api/login", name="login", methods={"POST"})
     */
    public function login(UserRepository $userRepository, SerializerInterface $serializer, Request $request): JsonResponse | Response
    { 
        /* Déclarer les encoders */
        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        /* Récupérer les données de la requête */
        $data = $request->getContent();

        /* Convertir en tableau */
        $formattedData = $serializer->deserialize($data, User::class, 'json');

        /* Récuperer le mail associé */
        $email = $formattedData->getEmail();
        
        /* Regarder si un User avec ce mail existe en BDD */
        $user = $userRepository->findOneBy(['Email' => $email]);

        if($user) {
            /* Convertir les données au format JSON */
            $user = $serializer->serialize($user, 'json');
            $response = new JsonResponse($user);
            return $response;
        } else {
            return new Response('Utilisateur inconnu', 200);
        }  
    }
}

