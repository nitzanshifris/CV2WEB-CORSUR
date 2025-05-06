-- Create activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster activity lookups
CREATE INDEX idx_activities_user ON activities (user_id);
CREATE INDEX idx_activities_type ON activities (type);
CREATE INDEX idx_activities_entity ON activities (entity_type, entity_id);
CREATE INDEX idx_activities_created ON activities (created_at); 