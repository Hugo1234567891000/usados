/*
  # Change property_id to TEXT type
  
  Change property_id from UUID to TEXT to match property.id which is a number
*/

ALTER TABLE property_3d_tours 
ALTER COLUMN property_id TYPE TEXT USING property_id::TEXT;