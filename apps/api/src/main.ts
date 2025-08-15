import { APIServer } from './api/server';
import 'dotenv/config';

// Main execution
async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.includes('--server') || args.includes('-s')) {
        // Start API server
        const port = parseInt(args.find(arg => arg.startsWith('--port='))?.split('=')[1] || process.env.PORT || '3030');
        const server = new APIServer(port);
        server.start();
    } else {
    }
}

if (require.main === module) {
    main().catch(console.error);
}
