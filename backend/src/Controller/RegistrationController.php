<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
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

class RegistrationController extends AbstractController
{
    #[Route('/registration', name: 'app_registration')]
    public function index(): Response
    {
        return $this->render('registration/index.html.twig', [
            'controller_name' => 'RegistrationController',
        ]);
    }

    /**
     * @Route("/api/register", name="register", methods={"POST"})
     */
    public function register(UserRepository $userRepository, SerializerInterface $serializer, EntityManagerInterface $entityManager, Request $request): JsonResponse | Response
    { 
        /* Déclarer les encoders */
        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        /* Récupérer les données de la requête */
        $data = $request->getContent();
        $user = $serializer->deserialize($data, User::class, 'json');
        if(isset($user)) {
            $entityManager->persist($user);
            $entityManager->flush();
            return new Response('Success', 201);
        } else {
            return new Response('Error', 200);
        }
    }
}
