-- Seeds SQL File

-- Insert Companies
INSERT INTO companies (id, company_name, company_status, created_at, updated_at) VALUES
  ('1', 'Empresa A', 1, NOW(), NOW()),
  ('2', 'Empresa B', 1, NOW(), NOW());

-- Insert Offices
INSERT INTO offices (id, company_id, office_name, office_status, created_at, updated_at) VALUES
  ('1', '1', 'Oficina Principal A', 1, NOW(), NOW()),
  ('2', '2', 'Oficina Principal B', 1, NOW(), NOW());

-- Insert Employees
INSERT INTO employees (id, office_id, employee_code, employee_name, employee_type, employee_status, created_at, updated_at) VALUES
  ('1', '1', 1001, 'Juan Pérez', 'Full-time', 1, NOW(), NOW()),
  ('2', '2', 1002, 'Ana Gómez', 'Part-time', 1, NOW(), NOW());

-- Insert Incidents
INSERT INTO incidents (id, incident_code, incident_name, incident_status, created_at, updated_at) VALUES
  ('1', 'INC001', 'Falla eléctrica', 1, NOW(), NOW()),
  ('2', 'INC002', 'Incendio menor', 1, NOW(), NOW());

-- Insert Movements
INSERT INTO movements (id, employee_code, incident_code, incidence_date, incidence_observation, incidence_status, created_at, updated_at) VALUES
  ('1', 1001, 'INC001', NOW(), 'Revisión en proceso', 1, NOW(), NOW()),
  ('2', 1002, 'INC002', NOW(), 'Incidente controlado', 1, NOW(), NOW());

-- Insert Users
INSERT INTO users (id, user_name, user_email, user_password, user_status, user_rol, created_at, updated_at) VALUES
  ('1', 'admin', 'admin@example.com', 'admin_pass', 1, 1, NOW(), NOW()),
  ('2', 'user', 'user@example.com', 'user_pass', 1, 2, NOW(), NOW());

-- Insert User Access
INSERT INTO user_access (id, user_id, company_id, office_id, status, created_at, updated_at) VALUES
  (1, '1', '1', '1', 1, NOW(), NOW()),
  (2, '2', '2', '2', 1, NOW(), NOW());

-- Insert Calendar
INSERT INTO calendar (month, period, `range`, incidentSubmission, `process`, policyGeneration, payment) VALUES
  ('January', '2025', 'Full Month', NOW(), NOW(), NOW(), NOW()),
  ('February', '2025', 'Full Month', NOW(), NOW(), NOW(), NOW());

