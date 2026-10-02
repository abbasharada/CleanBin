/*
# Lock down customer trigger helpers

1. Purpose
   Restricts internal database trigger functions so they cannot be called through the public Data API.

2. Modified Functions
   - `handle_new_customer_profile()` remains available to its auth-user trigger only.
   - `record_pickup_request_event()` remains available to the pickup trigger only.
   - `update_customer_profile_updated_at()` remains available to the profile trigger only.
   - `update_updated_at_column()` now uses a fixed `public` search path.

3. Security
   - Revoke EXECUTE from PUBLIC, anon, and authenticated for all internal trigger helpers.
   - Fix the mutable search path on the shared timestamp trigger function.

4. Important Notes
   - No customer or administrator data is changed.
   - Trigger behavior remains available to PostgreSQL when the protected tables are written.
*/

ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.handle_new_customer_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_pickup_request_event() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_customer_profile_updated_at() FROM PUBLIC, anon, authenticated;