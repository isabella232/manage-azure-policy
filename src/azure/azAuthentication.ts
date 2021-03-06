import * as exec from "@actions/exec";
import * as io from "@actions/io";

var azPath: string;
const resource = "https://management.azure.com/";

export async function getAccessToken(): Promise<string> {
  let accessToken = "";
  await getAADToken().then((token) => {
    const tokenObject = JSON.parse(token);
    accessToken = tokenObject.accessToken;
  });
  return accessToken;
}

async function getAADToken(): Promise<string> {
  azPath = await io.which("az", true);
  return await getTokenFromAzCLI(
    "account get-access-token --resource=" + resource
  );
}

async function getTokenFromAzCLI(command: string): Promise<string> {
  try {
    let output = "";
    let error = "";
    const options: any = {};
    options.silent = true;
    options.listeners = {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
      stderr: (data: Buffer) => {
        error += data.toString();
      },
    };
    await exec.exec(`"${azPath}" ${command}`, [], options);
    if (error) {
      throw new Error(error);
    }
    return output;
  } catch (error) {
    throw new Error(error);
  }
}