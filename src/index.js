import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath, pathToFileURL } from 'url';
import spawn from 'cross-spawn';
import ora from 'ora';
import figlet from 'figlet';

// Helper to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('niena-starter-kit')
  .description('CLI to bootstrap a Next.js app with NienaLabs stack')
  .version('1.0.0')
  .argument('[project-name]', 'Name of the project')
  .action((projectName) => runScaffold(projectName));

export const runScaffold = async (projectName, injectedPrompts = prompts, injectedSpawn = spawn) => {
    console.log(chalk.cyan(figlet.textSync('Niena\nStarter\nKit', { horizontalLayout: 'fitted' })));
    console.log(chalk.bold.blue('\n🚀 The Ultimate Next.js Starter Kit\n'));

    let targetDir = projectName;

    if (!targetDir) {
        const response = await injectedPrompts({
            type: 'text',
            name: 'projectName',
            message: 'What is your project named?',
            initial: 'my-app'
        });
        targetDir = response.projectName;
    }
    
    if (!targetDir) {
        console.log(chalk.red('Project name is required.'));
        // process.exit(1); // Don't exit in testable function, strictly.
        return; 
    }

    const questions = [
        {
            type: 'select',
            name: 'packageManager',
            message: 'Select Package Manager:',
            choices: [
                { title: 'npm', value: 'npm' },
                { title: 'pnpm', value: 'pnpm' },
                { title: 'yarn', value: 'yarn' },
                { title: 'bun', value: 'bun' }
            ],
            initial: 0
        },
        {
            type: 'select',
            name: 'auth',
            message: 'Select Authentication Provider:',
            choices: [
                { title: 'Better-auth', value: 'better-auth' },
                { title: 'None', value: 'none' }
            ],
            initial: 0
        },
        {
            type: (prev) => prev === 'better-auth' ? 'toggle' : null,
            name: 'betterAuthUi',
            message: 'Add Better-Auth UI?',
            initial: true,
            active: 'Yes',
            inactive: 'No'
        },
        {
            type: (prev, values) => {
                // If betterAuthUi is true, Shadcn is compulsory, so we skip asking but can inform user
                if (values.betterAuthUi) return null; 
                return 'toggle';
            },
            name: 'shadcn',
            message: 'Add Shadcn UI?',
            initial: true,
            active: 'Yes',
            inactive: 'No'
        },
        {
            type: 'select',
            name: 'orm',
            message: 'Select ORM:',
            choices: [
                { title: 'Prisma', value: 'prisma' }
            ],
            initial: 0
        },
        {
            type: 'toggle',
            name: 'trpc',
            message: 'Add tRPC?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        }
    ];

    const answers = await injectedPrompts(questions);
    
    // Normalize Shadcn choice
    if (answers.betterAuthUi) {
        answers.shadcn = true;
        console.log(chalk.cyan('ℹ️  Better-Auth UI requires Shadcn UI. Shadcn UI has been automatically enabled.'));
    } else if (answers.shadcn === undefined) {
        // Handle undefined if toggled off/skipped
        if (answers.auth !== 'better-auth') {
             // If auth is none, shadcn wasn't skipped by betterAuthUi check, but basic prompts logic
        }
    }

    const packageManager = answers.packageManager || 'npm';
    const pmRunCommand = packageManager === 'npm' ? 'npm run' : packageManager;

    console.log(chalk.gray('\nScaffolding project in ') + chalk.bold.white(targetDir) + '...');
    
    // 1. Create Next App
    console.log(chalk.blue('Creating Next.js app...'));
    try {
        const createNextAppFlags = [
            '-y',
            'create-next-app@latest', 
            targetDir,
            '--typescript',
            '--tailwind',
            '--eslint',
            '--app',
            '--skip-install',
            '--no-src-dir',
            '--import-alias', '@/*',
        ];

        if (packageManager === 'npm') createNextAppFlags.push('--use-npm');
        else if (packageManager === 'pnpm') createNextAppFlags.push('--use-pnpm');
        else if (packageManager === 'yarn') createNextAppFlags.push('--use-yarn');
        else if (packageManager === 'bun') createNextAppFlags.push('--use-bun');

        await new Promise((resolve, reject) => {
            const child = injectedSpawn('npx', createNextAppFlags, { stdio: 'inherit' });

            child.on('close', (code) => {
                if (code !== 0) reject(new Error('create-next-app failed'));
                else resolve();
            });
        });
        console.log(chalk.green('Next.js app created.'));
    } catch (e) {
        console.error(chalk.red('Failed to create Next.js app.'));
        console.error(e);
        // process.exit(1);
        return;
    }

    // 2. Prepare Template Paths
    const templateDir = path.join(__dirname, '../template');
    const projectRoot = path.resolve(process.cwd(), targetDir);

    // 3. Copy Files logic
    const copySpinner = ora('Copying template files...').start();
    
    try {
        await fs.copy(templateDir, projectRoot, {
            overwrite: true,
            filter: (src, dest) => {
                const rel = path.relative(templateDir, src);
                
                // Exclude stuff
                // Exclude stuff
                if (rel.includes('node_modules') || rel.includes('.git') || rel.includes('.next')) return false;
                
                // Exclude package manager files to prevent overwriting
                if (rel === 'package.json' || rel === 'package-lock.json' || rel === 'bun.lockb' || rel === 'yarn.lock' || rel === 'pnpm-lock.yaml') return false;

                // Feature flags exclusions
                
                // 1. Better-Auth UI exclusions
                if (!answers.betterAuthUi) {
                    // Exclude better-auth-ui-provider
                    if (rel.includes('better-auth-ui-provider')) return false;
                    // Exclude app/account
                    if (rel.startsWith('app/account') || rel.startsWith('app\\account')) return false;
                    if (rel.startsWith('app/auth') || rel.startsWith('app\\auth')) return false;
                }

                // 2. Auth exclusions (General)
                if (answers.auth !== 'better-auth') {
                     if (rel.startsWith('lib/auth.ts') || rel.startsWith('lib\\auth.ts')) return false;
                     if (rel.includes('api/auth')) return false;
                     if (rel.includes('better-auth-ui-provider')) return false;
                     if (rel.startsWith('app/account') || rel.startsWith('app\\account')) return false;
                     if (rel.startsWith('app/auth') || rel.startsWith('app\\auth')) return false;
                }

                // 3. Shadcn exclusions
                if (!answers.shadcn) {
                    // Exclude components/ui
                    if (rel.startsWith('components/ui') || rel.startsWith('components\\ui')) return false;
                    // Exclude globals.css from template if shadcn is OFF (keep create-next-app version)
                    if (rel === 'app/globals.css' || rel === 'app\\globals.css') return false;
                    // Exclude components.json
                    if (rel === 'components.json') return false;
                    // Start with removing providers dir if empty/unused? Handled in cleanup.
                }

                // 4. tRPC exclusions
                if (!answers.trpc) {
                    if (rel.startsWith('trpc') || rel.startsWith('trpc\\')) return false;
                    if (rel.startsWith('app/api/trpc') || rel.startsWith('app\\api\\trpc')) return false;
                }

                if (answers.orm !== 'prisma') {
                    if (rel.startsWith('prisma') || rel.startsWith('prisma\\')) return false;
                    if (rel.includes('lib/prisma.ts') || rel.includes('lib\\prisma.ts')) return false;
                }

                return true;
            }
        });
        copySpinner.succeed('Template files copied.');
    } catch (e) {
        copySpinner.fail('Failed to copy files.');
        console.error(e);
    }

    // 4. Post-processing files (Layout, CSS, etc.)
    const processSpinner = ora('Configuring files...').start();
    try {
        const layoutPath = path.join(projectRoot, 'app/layout.tsx');
        if (fs.existsSync(layoutPath)) {
            let layoutContent = await fs.readFile(layoutPath, 'utf-8');

            if (!answers.betterAuthUi) {
                // Remove provider import
                layoutContent = layoutContent.replace(/import BetterAuthUIProvider from "@\/providers\/better-auth-ui-provider"/g, '');
                // Remove wrapping component
                layoutContent = layoutContent.replace(/<BetterAuthUIProvider>{children}<\/BetterAuthUIProvider>/g, '{children}');
                // Remove Toaster import
                layoutContent = layoutContent.replace(/import { Toaster } from "@\/components\/ui\/sonner"/g, '');
                // Remove Toaster component
                layoutContent = layoutContent.replace(/<Toaster \/>/g, '');
            }

            if (!answers.trpc) {
                 // Remove TRPC import
                 layoutContent = layoutContent.replace(/import {TRPCProvider} from '@\/trpc\/client'/g, ''); // Handle simple case
                 layoutContent = layoutContent.replace(/import\s+{\s*TRPCProvider\s*}\s+from\s+['"]@\/trpc\/client['"];?/g, ''); // Regex for better match
                 
                 // Remove TRPCProvider wrapper
                 layoutContent = layoutContent.replace(/<TRPCProvider>/g, '');
                 layoutContent = layoutContent.replace(/<\/TRPCProvider>/g, '');
            }

            await fs.writeFile(layoutPath, layoutContent);
        }



        // Post-process globals.css if Shadcn is ON but Better-Auth UI is OFF
        if (answers.shadcn && !answers.betterAuthUi) {
             const cssPath = path.join(projectRoot, 'app/globals.css');
             if (fs.existsSync(cssPath)) {
                 let cssContent = await fs.readFile(cssPath, 'utf-8');
                 cssContent = cssContent.replace('@import "@daveyplate/better-auth-ui/css";', '');
                 await fs.writeFile(cssPath, cssContent);
             }
        }

        // Cleanup directories
        // Remove 'providers' if betterAuthUi is false
        if (!answers.betterAuthUi) {
            await fs.remove(path.join(projectRoot, 'providers'));
        }

        // Cleanup components/ui if !shadcn
        if (!answers.shadcn) {
             const componentsUiPath = path.join(projectRoot, 'components/ui');
             await fs.remove(componentsUiPath);
             // Also remove components.json if it snuck in (though filtered)
             await fs.remove(path.join(projectRoot, 'components.json'));
        }
        
        // Remove empty components dir if empty
        const componentsPath = path.join(projectRoot, 'components');
        if (fs.existsSync(componentsPath)) {
            const files = await fs.readdir(componentsPath);
            if (files.length === 0) await fs.remove(componentsPath);
        }

        processSpinner.succeed('Files configured.');
    } catch(e) {
        processSpinner.fail('File configuration failed.');
        console.error(e);
    }

    // 5. Merge package.json
    const depSpinner = ora('Updating dependencies...').start();
    try {
        const templatePkg = await fs.readJson(path.join(templateDir, 'package.json'));
        const targetPkgPath = path.join(projectRoot, 'package.json');
        const targetPkg = await fs.readJson(targetPkgPath);

        const dependenciesToAdd = {};
        const devDependenciesToAdd = {};

        // Always add basic utils from template (clsx, tailwind-merge, etc)
        const commonDeps = ['clsx', 'tailwind-merge', 'lucide-react', 'class-variance-authority'];
        commonDeps.forEach(d => {
             if (templatePkg.dependencies[d]) dependenciesToAdd[d] = templatePkg.dependencies[d];
        });
        
        // Auth
        if (answers.auth === 'better-auth') {
            dependenciesToAdd['better-auth'] = templatePkg.dependencies['better-auth'];
            dependenciesToAdd['@prisma/client'] = templatePkg.dependencies['@prisma/client'];
            dependenciesToAdd['@prisma/adapter-pg'] = templatePkg.dependencies['@prisma/adapter-pg'];
            
            if (answers.betterAuthUi) {
                dependenciesToAdd['@daveyplate/better-auth-ui'] = templatePkg.dependencies['@daveyplate/better-auth-ui'];
                dependenciesToAdd['@captchafox/react'] = templatePkg.dependencies['@captchafox/react'];
                dependenciesToAdd['next-themes'] = templatePkg.dependencies['next-themes'];
                dependenciesToAdd['@marsidev/react-turnstile'] = templatePkg.dependencies['@marsidev/react-turnstile'];
            }
        }

        // Shadcn
        if (answers.shadcn) {
            // copy all radix-ui, cmdk, etc.
             Object.keys(templatePkg.dependencies).forEach(key => {
                 if (key.startsWith('@radix-ui') || 
                     ['cmdk', 'date-fns', 'embla-carousel-react', 'input-otp', 'react-day-picker', 'react-hook-form', 'react-resizable-panels', 'recharts', 'sonner', 'vaul', 'zod', '@hookform/resolvers'].includes(key)) {
                     dependenciesToAdd[key] = templatePkg.dependencies[key];
                 }
             });
             if (templatePkg.devDependencies['tw-animate-css']) devDependenciesToAdd['tw-animate-css'] = templatePkg.devDependencies['tw-animate-css'];
        }

        // Prisma
        if (answers.orm === 'prisma') {
             dependenciesToAdd['@prisma/client'] = templatePkg.dependencies['@prisma/client'];
             dependenciesToAdd['@prisma/adapter-pg'] = templatePkg.dependencies['@prisma/adapter-pg'];
             devDependenciesToAdd['prisma'] = templatePkg.devDependencies['prisma'];
             devDependenciesToAdd['@types/pg'] = templatePkg.devDependencies['@types/pg'];
             dependenciesToAdd['pg'] = templatePkg.dependencies['pg'];
        }

        // tRPC
        if (answers.trpc) {
             Object.keys(templatePkg.dependencies).forEach(key => {
                 if (key.startsWith('@trpc') || 
                     ['@tanstack/react-query', 'superjson', 'server-only', 'client-only'].includes(key)) {
                     dependenciesToAdd[key] = templatePkg.dependencies[key];
                 }
             });
        }

        targetPkg.dependencies = { ...targetPkg.dependencies, ...dependenciesToAdd };
        targetPkg.devDependencies = { ...targetPkg.devDependencies, ...devDependenciesToAdd };

        await fs.writeJson(targetPkgPath, targetPkg, { spaces: 2 });
        depSpinner.succeed('Dependencies updated.');

    } catch (e) {
        depSpinner.fail('Dependencies update failed.');
        console.error(e);
    }
    
    // 6. Install Deps
    console.log(chalk.bold.blue('\nInstalling dependencies...'));
    try {
        await new Promise((resolve, reject) => {
             const child = injectedSpawn(packageManager, ['install'], { cwd: projectRoot, stdio: 'inherit' });
             child.on('close', (code) => {
                 if (code !== 0) reject(new Error(`${packageManager} install failed`));
                 else resolve();
             });
        });
        console.log(chalk.green('Dependencies installed.'));
    } catch(e) {
        console.error(chalk.red('Failed to install dependencies.'));
        console.error(e);
    }

    console.log(chalk.bold.green('\n✅ Project setup complete!'));
    console.log(`\nTo get started:\n  cd ${targetDir}\n  ${pmRunCommand} dev`);
};



// Only run if called directly (this logic might need checking for ESM)
// Commander handles execution when .parse() is called.
// To make it testable, we might just export the "program" or the action handler.

export const run = async () => {
    program.parse(process.argv);
};

// Optional: Keep this if you want `node src/index.js` to work, but strict check fails for bin usage
if (import.meta.url === pathToFileURL(process.argv[1]).href && process.env.NODE_ENV !== 'test') {
    run();
}

export { program }; // Export program for potential testing invocation

