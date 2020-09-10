import * as fs from "fs";
import * as path from "path";
import { Compile, parse } from "amplify-velocity-template";
import { map } from "amplify-appsync-simulator/lib/velocity/value-mapper/mapper";
import * as utils from "amplify-appsync-simulator/lib/velocity/util";

/**
 * VTLファイル内で展開される context を作成する
 */
const createVtlContext = <T>(args: T) => {
  const util = utils.create([], new Date(Date.now()), Object());
  const context = {
    args,
    arguments: args,
  };
  return {
    util,
    utils: util,
    ctx: context,
    context,
  };
};

/**
 * 指定パスのファイルを参照し、入力パラメータをもとに、vtlファイルによりマッピングされたリゾルバリクエストJSONをロードする
 */
const vtlLoader = (filePath: string, args: any) => {
  const vtlPath = path.resolve(__dirname, filePath);
  const vtl = parse(fs.readFileSync(vtlPath, { encoding: "utf8" }));
  const compiler = new Compile(vtl, { valueMapper: map, escape: false });
  const context = createVtlContext(args);
  const result = JSON.parse(compiler.render(context));
  return result;
};

describe("mapping-templates", () => {
  test("getTask.request.vtl", () => {
    const args = {
      id: "000",
      status: "InProgress",
    };
    const result = vtlLoader("../mapping-templates/getTask.request.vtl", args);
    expect(result).toStrictEqual({
      version: "2018-05-29",
      operation: "GetItem",
      key: {
        id: { S: "000" },
        status: { S: "InProgress" },
      },
    });
  });
});
