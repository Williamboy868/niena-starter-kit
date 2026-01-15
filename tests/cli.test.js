
import { program } from '../src/index.js';

describe('CLI Program', () => {
    it('has the correct name', () => {
        expect(program.name()).toBe('niena-starter-kit');
    });

    it('has the correct arguments', () => {
        const arg = program.registeredArguments.find(a => a.name() === 'project-name');
        expect(arg).toBeDefined();
    });
});
