-- =====================================================
-- GHOSTDASH - STORAGE SETUP
-- Exécute ces commandes dans Supabase SQL Editor
-- =====================================================

-- 1. Créer le bucket pour les screenshots de paiement
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Policy pour permettre aux utilisateurs authentifiés d'uploader
CREATE POLICY "Users can upload payment screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-screenshots');

-- 3. Policy pour permettre aux super_admin de voir tous les screenshots
CREATE POLICY "Super admin can view all payment screenshots"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-screenshots' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'super_admin'
  )
);

-- 4. Policy pour permettre aux users de voir leurs propres screenshots
CREATE POLICY "Users can view their own payment screenshots"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-screenshots' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- SELECT * FROM storage.buckets WHERE id = 'payment-screenshots';
