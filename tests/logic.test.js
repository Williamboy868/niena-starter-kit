
import { jest } from '@jest/globals';

// Mock fs-extra
const mockLayoutContent = `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {TRPCProvider} from '@/trpc/client'
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import BetterAuthUIProvider from "@/providers/better-auth-ui-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCProvider>
    <html lang="en">
      <body
        className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}
      >
     <BetterAuthUIProvider>{children}</BetterAuthUIProvider>
        <Toaster />
      </body>
    </html>
    </TRPCProvider>
  );
}
`;

    jest.unstable_mockModule('fs-extra', () => ({
        default: {
            copy: jest.fn(),
            readJson: jest.fn(() => Promise.resolve({ dependencies: {}, devDependencies: {} })),
            writeJson: jest.fn(),
            readFile: jest.fn((path) => {
                if (path && path.includes('layout.tsx')) return Promise.resolve(mockLayoutContent);
                return Promise.resolve('');
            }),
            writeFile: jest.fn(),
            existsSync: jest.fn(() => true),
            readdir: jest.fn(() => Promise.resolve([])),
            remove: jest.fn(),
        }
    }));

// Mock ora
jest.unstable_mockModule('ora', () => ({
    default: () => ({
        start: () => ({
            succeed: jest.fn(),
            fail: jest.fn(),
        }),
    }),
}));

// Mock figlet
jest.unstable_mockModule('figlet', () => ({
    default: {
        textSync: jest.fn(() => 'Mock Banner'),
    },
}));

const { runScaffold } = await import('../src/index.js');
const fs = await import('fs-extra');

describe('runScaffold Logic', () => {
    let mockPrompts;
    let mockSpawn;
    let spawnChild;

    beforeEach(() => {
        spawnChild = {
            on: jest.fn((event, cb) => cb(0)) // Success by default
        };
        mockSpawn = jest.fn(() => spawnChild);
        jest.clearAllMocks();
    });

    it('scaffolds a full stack project with npm by default', async () => {
        mockPrompts = jest.fn()
            .mockResolvedValueOnce({ 
                packageManager: 'npm',
                auth: 'better-auth', 
                betterAuthUi: true,
                shadcn: true, 
                orm: 'prisma',
                trpc: true
            });

        await runScaffold('test-app', mockPrompts, mockSpawn);

        expect(mockSpawn).toHaveBeenCalledWith('npx', expect.arrayContaining(['create-next-app@latest', 'test-app', '--use-npm']), expect.any(Object));
        expect(mockSpawn).toHaveBeenCalledWith('npm', ['install'], expect.objectContaining({ cwd: expect.stringContaining('test-app') }));
        expect(fs.default.copy).toHaveBeenCalled();
    });

    it('scaffolds a project with pnpm', async () => {
        mockPrompts = jest.fn()
            .mockResolvedValueOnce({ 
                packageManager: 'pnpm',
                auth: 'none', 
                shadcn: false,
                orm: 'prisma',
                trpc: false
            });

        await runScaffold('pnpm-app', mockPrompts, mockSpawn);

        expect(mockSpawn).toHaveBeenCalledWith('npx', expect.arrayContaining(['create-next-app@latest', 'pnpm-app', '--use-pnpm']), expect.any(Object));
        expect(mockSpawn).toHaveBeenCalledWith('pnpm', ['install'], expect.objectContaining({ cwd: expect.stringContaining('pnpm-app') }));
    });

    it('scaffolds a project with yarn', async () => {
        mockPrompts = jest.fn()
            .mockResolvedValueOnce({ 
                packageManager: 'yarn',
                auth: 'none', 
                shadcn: false,
                orm: 'prisma',
                trpc: false
            });

        await runScaffold('yarn-app', mockPrompts, mockSpawn);

        expect(mockSpawn).toHaveBeenCalledWith('npx', expect.arrayContaining(['create-next-app@latest', 'yarn-app', '--use-yarn']), expect.any(Object));
        expect(mockSpawn).toHaveBeenCalledWith('yarn', ['install'], expect.objectContaining({ cwd: expect.stringContaining('yarn-app') }));
    });

    it('scaffolds a project with bun', async () => {
        mockPrompts = jest.fn()
            .mockResolvedValueOnce({ 
                packageManager: 'bun',
                auth: 'none', 
                shadcn: false,
                orm: 'prisma',
                trpc: false
            });

        await runScaffold('bun-app', mockPrompts, mockSpawn);

        expect(mockSpawn).toHaveBeenCalledWith('npx', expect.arrayContaining(['create-next-app@latest', 'bun-app', '--use-bun']), expect.any(Object));
        expect(mockSpawn).toHaveBeenCalledWith('bun', ['install'], expect.objectContaining({ cwd: expect.stringContaining('bun-app') }));
    });

    it('scaffolds a project and removes tRPC provider when trpc is false', async () => {
        mockPrompts = jest.fn()
            .mockResolvedValueOnce({ 
                packageManager: 'npm',
                auth: 'better-auth', 
                betterAuthUi: true,
                shadcn: true, 
                orm: 'prisma',
                trpc: false
            });

        await runScaffold('no-trpc-app', mockPrompts, mockSpawn);

        expect(fs.default.writeFile).toHaveBeenCalledWith(
            expect.stringContaining('layout.tsx'),
            expect.not.stringContaining('<TRPCProvider>')
        );
        expect(fs.default.writeFile).toHaveBeenCalledWith(
            expect.stringContaining('layout.tsx'),
            expect.not.stringContaining('import {TRPCProvider}')
        );
    });
});
