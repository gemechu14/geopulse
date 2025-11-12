# Environment Variables Setup

## Quick Setup

1. **Copy the template file:**
   ```bash
   cp env.template .env
   ```

2. **Edit the `.env` file** with your own values:

### Required Changes

#### PostgreSQL Configuration
```env
POSTGRES_HOST=localhost          # Your PostgreSQL host
POSTGRES_PORT=5432               # Your PostgreSQL port (default: 5432)
POSTGRES_DB=geopulse             # Your database name
POSTGRES_USER=your_username      # Your PostgreSQL username
POSTGRES_PASSWORD=your_password # Your PostgreSQL password
```

#### MongoDB Configuration
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/geopulse

# MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geopulse?retryWrites=true&w=majority

# MongoDB with authentication
# MONGODB_URI=mongodb://username:password@localhost:27017/geopulse
```

#### JWT Secret (IMPORTANT!)
```env
# Generate a secure random key:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

JWT_SECRET=your-generated-secret-key-here
```

#### CORS Configuration
```env
# Development (allow all)
CORS_ORIGIN=*

# Production (specific domain)
CORS_ORIGIN=https://yourdomain.com

# Multiple origins (if needed, update src/app.ts)
CORS_ORIGIN=http://localhost:3000
```

## Example Configuration

### Local Development
```env
NODE_ENV=development
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=geopulse
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mypassword
MONGODB_URI=mongodb://localhost:27017/geopulse
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
SWAGGER_HOST=localhost:3000
SWAGGER_SCHEMES=http
```

### Production
```env
NODE_ENV=production
PORT=3000
POSTGRES_HOST=your-postgres-host.com
POSTGRES_PORT=5432
POSTGRES_DB=geopulse_prod
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=strong-production-password
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/geopulse
JWT_SECRET=super-secure-random-key-generated-with-crypto
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://yourdomain.com
SWAGGER_HOST=api.yourdomain.com
SWAGGER_SCHEMES=https
```

## Security Notes

1. **Never commit `.env` to version control** - It's already in `.gitignore`
2. **Use strong, random JWT secrets** in production
3. **Use environment-specific database credentials**
4. **Restrict CORS origins** in production to your actual domain
5. **Use HTTPS** in production (update `SWAGGER_SCHEMES=https`)

## Generating a Secure JWT Secret

Run this command to generate a secure random key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET` value.

