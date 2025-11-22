// client/setup.js
import fs from 'fs';
import path from 'path';

// Create .env file
const envContent = `# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000

# Application Configuration
VITE_APP_NAME="Inventory Management System"
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_REPORTS=true
VITE_ENABLE_WEBSOCKET=true
`;

// Create directory structure
const directories = [
  'src/components/common/Layout',
  'src/components/common/UI',
  'src/components/common/charts',
  'src/components/auth',
  'src/components/dashboard',
  'src/components/products',
  'src/components/receipts',
  'src/components/deliveries',
  'src/components/transfers',
  'src/components/adjustments',
  'src/components/warehouses',
  'src/components/reports',
  'src/components/advanced/DataGrid',
  'src/components/advanced/Search',
  'src/components/advanced/Upload',
  'src/components/advanced/Export',
  'src/components/charts/AdvancedCharts',
  'src/components/charts/RealTimeCharts',
  'src/components/workflow',
  'src/pages/Auth',
  'src/pages/Products',
  'src/pages/Receipts',
  'src/pages/Deliveries',
  'src/pages/Transfers',
  'src/pages/Adjustments',
  'src/pages/Warehouses',
  'src/pages/Advanced/Analytics',
  'src/pages/Advanced/Reports',
  'src/pages/Advanced/Settings',
  'src/pages/Mobile',
  'src/contexts',
  'src/hooks/advanced',
  'src/hooks/custom',
  'src/services/api',
  'src/services/websocket',
  'src/services/export',
  'src/services/import',
  'src/utils/export',
  'src/utils/import',
  'src/utils/calculations',
  'src/utils/helpers',
  'src/styles'
];

// Create directories
directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Write .env file
fs.writeFileSync('.env', envContent);
console.log('Created .env file');

// Write .env.example file
fs.writeFileSync('.env.example', envContent);
console.log('Created .env.example file');

console.log('Setup completed! Run "npm install" to install dependencies.');