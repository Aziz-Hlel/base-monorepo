#!/usr/bin/env node
import { execSync, spawnSync } from 'child_process';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Colors
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m';

// Get env argument: dev / stage / prod
const envArg = process.argv[2];
if (!envArg) {
  console.error('Please provide an environment argument. Usage: node docker-up.js <env>');
  console.error('Available environments: local, dev, stage, prod');
  process.exit(1);
}

if (!['local', 'dev', 'stage', 'prod'].includes(envArg)) {
  console.error(`Invalid environment: ${envArg}`);
  console.error('Available environments: local, dev, stage, prod');
  process.exit(1);
}

// Paths
const ROOT = execSync('git rev-parse --show-toplevel').toString().trim();
const DOCKER_ROOT = join(ROOT, 'docker');

const ENV_LOCAL = join(ROOT, '.env.local');
const ENV_ROOT = join(ROOT, '.env');

const ENV_MAP = {
  local: join(ROOT, 'config', '.env.local'),
  dev: join(ROOT, 'config', '.env.dev'),
  stage: join(ROOT, 'config', '.env.stage'),
  prod: join(ROOT, 'config', '.env.prod'),
};

const DOCKER_COMPOSE_MAP = {
  local: join(DOCKER_ROOT, 'compose.local.yml'),
  dev: join(DOCKER_ROOT, 'compose.dev.yml'),
  stage: join(DOCKER_ROOT, 'compose.stage.yml'),
  prod: join(DOCKER_ROOT, 'compose.prod.yml'),
};

// Ensure env files exist
[ENV_LOCAL, ENV_ROOT, ENV_MAP[envArg]].forEach((f) => {
  if (!existsSync(f)) writeFileSync(f, '');
});

// Merge env files
const env = {
  ...process.env,
  ...loadEnv(ENV_MAP[envArg]),
  ...loadEnv(ENV_LOCAL),
  ...loadEnv(ENV_ROOT),
  PROJECT_ROOT: ROOT,
};

env.PROJECT_ROOT = ROOT;
console.log(env);
// Logs
console.log(`${YELLOW}🚀 Starting Docker in ${envArg.toUpperCase()} Env...${NC}`);

// Run Docker Compose
spawnSync('docker', ['compose', '-f', DOCKER_COMPOSE_MAP[envArg], 'up', '--build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ...loadEnv(ENV_ROOT),
    ...loadEnv(ENV_MAP[envArg]),
    ...loadEnv(ENV_LOCAL),
    PROJECT_ROOT: ROOT,
  },
});

console.log(`${GREEN}✅ Done!${NC}`);

// Helper: parse .env
function loadEnv(path) {
  if (!existsSync(path)) return {};
  return dotenv.parse(readFileSync(path));
}
