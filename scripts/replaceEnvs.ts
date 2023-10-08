import { config as configEnv } from 'dotenv';
import * as glob from 'glob';
import fse from 'fs-extra';

configEnv();

const NAME_OPTIONS = '--name=';

async function main() {
	const args = process.argv.slice(2);
	const searchPaths = args.filter((x) => !x.startsWith(NAME_OPTIONS));
	const envNames =
		args
			.find((x) => x.startsWith(NAME_OPTIONS))
			?.slice(NAME_OPTIONS.length)
			.split(',')
			.map((x) => x.trim()) || [];

	if (envNames.length === 0) {
		throw new Error('Not environment variable names were specified, use --name="SECRET_KEY,PORT"');
	}

	const files: string[] = [];

	for (const searchPath of searchPaths) {
		if (searchPath.includes('*')) {
			const globResult = glob.sync(searchPath);
			files.push(...globResult);
		} else {
			const exists = await fse.exists(searchPath);
			if (!exists) {
				throw new Error(`Could not find: '${searchPath}'`);
			}

			const stats = await fse.stat(searchPath);
			if (stats.isDirectory()) {
				const directoryFiles = await fse.readdir(searchPath, { recursive: true, encoding: 'utf8' });
				files.push(...directoryFiles);
			} else {
				files.push(searchPath);
			}
		}
	}

	if (files.length === 0) {
		console.log('⚠️  No files found: ', searchPaths);
		return;
	}

	console.log('✅ Files to replace with environment variables: ', files);
	const promises: Promise<void>[] = [];

	const envs = Object.entries(process.env)
		.filter(([_, value]) => value != null)
		.filter(([name, _]) => envNames.some((env) => env === name)) as [string, string][];

	for (const file of files) {
		const task = async () => {
			const fileContents = await fse.readFile(file, { encoding: 'utf8' });
			let newContents = fileContents;

			for (const [name, value] of envs) {
				const replaced = newContents.replaceAll(`process.env.${name}`, JSON.stringify(value));

				if (newContents !== replaced) {
					newContents = replaced;
					console.log(`📄 Environment variable 'process.env.${name}' was replaced in: ${file}`);
				}
			}

			// Replace other `process.env.VAR` with an empty object `{}`
			const processEnvRegex = /process\.env\.[A-Za-z0-9_]+/g;
			let matches: RegExpExecArray | null;

			let anyUnmatchedProcessEnv = false;

			while ((matches = processEnvRegex.exec(newContents))) {
				if (matches && matches.length > 0) {
					anyUnmatchedProcessEnv = true;

					for (const match of matches) {
						console.log(`🚧 replacing '${match}' with empty '{}'`);
					}
				}
			}

			if (anyUnmatchedProcessEnv) {
				newContents = newContents.replaceAll(/process.env/g, '{}');
			}

			if (newContents !== fileContents) {
				await fse.writeFile(file, newContents);
			}
		};

		promises.push(task());
	}
}

main().catch(console.error);
