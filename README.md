# Fronthyre Backend

Express API for Fronthyre professional forms (Early Access + Buildathon).

## Environments

Use **separate databases** per environment (recommended), not a column on each row.

| Environment | Env file | Example DB |
|-------------|----------|------------|
| Development | `.env.development` | `frontyre_dev` |
| Production | `.env.production` | `frontyre_prod` |

Copy the matching example file and adjust credentials:

```bash
cp .env.development.example .env.development
cp .env.production.example .env.production
```

Run locally (MySQL via Docker Desktop):

```bash
npm install
npm run docker:up
cp .env.development.example .env.development
npm run dev
```

Connect any SQL client to `127.0.0.1:3306`, database `frontyre_dev`, user `frontyre` (password in `docker-compose.yml`).

Production uses AWS RDS — keep credentials only in `.env.production` on the server (never commit). Rotate RDS password if it was shared in chat.

Production:

```bash
npm start
```

Migrations run automatically on server start. You can also run:

```bash
npm run migrate
```

## Professional APIs (v1)

Base path: `/api/v1/professionals`

### Early Access (matches FE form)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/early-access/form-options` | Public | Dropdown values for FE |
| POST | `/early-access` | Public | Submit form (`multipart/form-data`, field `resume` optional) |
| GET | `/early-access` | `X-Admin-Api-Key` | Paginated list (`page`, `limit`, filters) |
| GET | `/early-access/:publicId` | `X-Admin-Api-Key` | Single submission |

**Table:** `professional_early_access_submissions`

### Buildathon (professionals)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/buildathon/form-options` | Public | Track enum values |
| POST | `/buildathon` | Public | JSON body registration |
| GET | `/buildathon` | `X-Admin-Api-Key` | Paginated list |

**Table:** `professional_buildathon_registrations`

## Field names (FE contract)

Use **snake_case** exactly as below so tables and API stay aligned.

### Early Access — required

- `full_name`, `email`
- `consent_age_18_or_older` (boolean, must be true)
- `consent_privacy_and_data_processing` (boolean, must be true)

### Early Access — optional

- `mobile_number`, `current_role`, `years_of_experience`, `experience_level`
- `primary_skills`, `secondary_skills` (comma-separated text)
- `pref_location`, `experience_level`, `work_preference`, `job_search_status`, `notice_period`
- `linkedin_url`, `github_url`, `portfolio_url`, `other_relevant_url`
- `resume` (file: PDF/DOC/DOCX, max 5MB)
- `consent_marketing_communications`, `consent_job_matching`

### Buildathon — required

- `full_name`, `email`
- `consent_age_18_or_older`, `consent_privacy_and_data_processing`

### Buildathon — optional

- `mobile_number`, `current_role`, `years_of_experience`, `primary_skills`
- `preferred_track`, `pref_location`, `experience_level`, `work_preference`, `job_search_status`, `notice_period`
- `linkedin_url`, `github_url`, `portfolio_url`
- `consent_marketing_communications`

Enum values are returned from the `form-options` endpoints.

## Example: Early Access submit (multipart)

```bash
curl -X POST http://localhost:3000/api/v1/professionals/early-access \
  -F "full_name=Jane Doe" \
  -F "email=jane@example.com" \
  -F "primary_skills=React,TypeScript" \
  -F "consent_age_18_or_older=true" \
  -F "consent_privacy_and_data_processing=true" \
  -F "resume=@./resume.pdf"
```

Response includes `public_id` (UUID) for support lookups; internal numeric `id` is not exposed on create.
