-- Create statistics table
CREATE TABLE statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  metric_value JSONB NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (site_id, metric_name, date)
);

-- Create statistics_aggregates table
CREATE TABLE statistics_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  time_period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  metric_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (site_id, metric_name, time_period, start_date)
);

-- Create function to aggregate statistics
CREATE OR REPLACE FUNCTION aggregate_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Aggregate daily statistics
  INSERT INTO statistics_aggregates (
    site_id,
    metric_name,
    time_period,
    start_date,
    end_date,
    metric_value
  )
  SELECT
    site_id,
    metric_name,
    'daily',
    date,
    date,
    jsonb_build_object(
      'count', COUNT(*),
      'sum', SUM((metric_value->>'value')::numeric),
      'avg', AVG((metric_value->>'value')::numeric),
      'min', MIN((metric_value->>'value')::numeric),
      'max', MAX((metric_value->>'value')::numeric)
    )
  FROM statistics
  WHERE date = CURRENT_DATE
  GROUP BY site_id, metric_name, date
  ON CONFLICT (site_id, metric_name, time_period, start_date)
  DO UPDATE SET
    metric_value = EXCLUDED.metric_value,
    updated_at = CURRENT_TIMESTAMP;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for statistics aggregation
CREATE TRIGGER aggregate_statistics_trigger
  AFTER INSERT ON statistics
  FOR EACH ROW
  EXECUTE FUNCTION aggregate_statistics(); 