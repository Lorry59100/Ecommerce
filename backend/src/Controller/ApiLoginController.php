<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class ApiLoginController extends AbstractController
{
    /**
     * @Route("/api/login", name="api_login", methods={"POST"})
     */
    public function login(#[CurrentUser] ?User $user, UserRepository $userRepository, SerializerInterface $serializer, Request $request): JsonResponse | Response
    {
        /* Récupérer les données de la requête */
        $data = $request->getContent();

        /* Convertir en objet User */
        $formattedData = $serializer->deserialize($data, User::class, 'json');

        /* Récupérer l'email associé */
        $email = $formattedData->getEmail();

        /* Regarder si un User avec cet email existe en BDD */
        $user = $userRepository->findOneBy(['Email' => $email]);

        if ($user) {
            /* Générer un jeton d'authentification fictif */
            $token = '4545dfhjkghsk';

            /* Retourner les données de l'utilisateur et le jeton en JSON */
            return $this->json([
                'user'  => $user->getUserIdentifier(),
                'token' => $token,
            ]);
        } else {
            /* Utilisateur non trouvé, retourner une réponse 404 */
            return new Response('Utilisateur inconnu', 404);
        }
    }
}
