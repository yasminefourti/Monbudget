<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\ResetPassword\Controller\ResetPasswordControllerTrait;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

#[Route('/reset-password')]
class ResetPasswordController extends AbstractController
{
    use ResetPasswordControllerTrait;

    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * API: Request a password reset (send email)
     */
    #[Route('', name: 'app_forgot_password_request', methods: ['POST'])]
    public function request(
        Request $request,
        MailerInterface $mailer,
        TranslatorInterface $translator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'])) {
            return new JsonResponse(['error' => 'Email is required'], 400);
        }

        return $this->processSendingPasswordResetEmail($data['email'], $mailer, $translator);
    }

    /**
     * API: Confirm token exists (used by frontend to check link validity)
     */
    #[Route('/check/{token}', name: 'app_check_email', methods: ['GET'])]
    public function checkEmail(string $token): JsonResponse
    {
        try {
            $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        } catch (ResetPasswordExceptionInterface $e) {
            return new JsonResponse(['valid' => false, 'error' => 'Invalid or expired token'], 400);
        }

        return new JsonResponse(['valid' => true, 'email' => $user->getEmail()]);
    }

    /**
     * API: Reset the password with a valid token
     */
    #[Route('/reset/{token}', name: 'app_reset_password', methods: ['POST'])]
    public function reset(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        TranslatorInterface $translator,
        string $token
    ): JsonResponse {
        try {
            /** @var User $user */
            $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        } catch (ResetPasswordExceptionInterface $e) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 400);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['plainPassword'])) {
            return new JsonResponse(['error' => 'Password is required'], 400);
        }

        // Remove token (single use)
        $this->resetPasswordHelper->removeResetRequest($token);

        // Update password
        $user->setPassword($passwordHasher->hashPassword($user, $data['plainPassword']));
        $this->entityManager->flush();

        // Clean session (optional in API)
        $this->cleanSessionAfterReset();

        return new JsonResponse(['message' => 'Password successfully reset']);
    }

    private function processSendingPasswordResetEmail(
        string $emailFormData,
        MailerInterface $mailer,
        TranslatorInterface $translator
    ): JsonResponse {
        $user = $this->entityManager->getRepository(User::class)->findOneBy([
            'email' => $emailFormData,
        ]);

        // Always return success to prevent email enumeration
        if (!$user) {
            return new JsonResponse(['message' => 'If your email exists, a reset link has been sent.']);
        }

        try {
            $resetToken = $this->resetPasswordHelper->generateResetToken($user);
        } catch (ResetPasswordExceptionInterface $e) {
            return new JsonResponse(['error' => 'Unable to generate reset token'], 500);
        }

        $email = (new TemplatedEmail())
            ->from(new Address('no-reply@monbudget.com', 'YassBudget App'))
            ->to((string) $user->getEmail())
            ->subject('Your password reset request')
            ->htmlTemplate('reset_password/email.html.twig')
            ->context([
                'resetToken' => $resetToken,
            ]);

        $mailer->send($email);

        return new JsonResponse([
            'message' => 'Reset email sent',
            'token' => $resetToken->getToken() // ⚠️ à retirer en prod pour la sécurité
        ]);
    }
}
