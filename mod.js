import { Command } from "cliffy";

const id = (a) => a;
const formatter = (options) => options.json ? JSON.stringify : id;

const getTools = async () => {
  try {
    const content = await Deno.readTextFile(`${Deno.cwd()}/.tool-versions`);
    const tools = Object.fromEntries(
      content.split("\n").filter((s) => s !== "").map((tool) =>
        tool.split(" ")
      ),
    );

    return tools;
  } catch {
    return {};
  }
};

const version = async (options, ...args) => {
  const plugin = args[0];

  const format = formatter(options);
  const tools = await getTools();
  const version = tools[plugin];

  if (version) {
    console.log(format(version));
  }
};

const list = async (options) => {
  const tools = await getTools();

  console.log(
    options.json ? Object.keys(tools) : Object.keys(tools).join("\n"),
  );
};

await new Command()
  .name("toolz")
  .version("0.1.0")
  .description("asdf .tool-versions parser")
  .globalOption("--json", "json output")
  // ls command
  .command("ls", "list all plugins")
  .action(list)
  // version command
  .command("version", "get plugin version")
  .arguments("<plugin:string> [version:string]")
  .action(version)
  .parse(Deno.args);
