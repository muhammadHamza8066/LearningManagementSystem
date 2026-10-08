<?php

declare(strict_types=1);

/**
 * Resolves the current user from the PHP session.
 * Returns the user id, or null when nobody is logged in.
 */
final class Auth
{
    public static function userId(): ?string
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        $id = $_SESSION['user_id'] ?? null;

        return is_string($id) && $id !== '' ? $id : null;
    }
}
