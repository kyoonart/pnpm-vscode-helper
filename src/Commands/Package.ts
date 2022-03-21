import * as vscode from 'vscode';
import { Utils } from '../Utils';
import { ICommandRegistry, PackageFilterType } from '../Utils/Typings';
import { ExtensionConfiguration } from '../Configurations';

/**
 * we provide 2 ways to execute package task:
 * - select a package, choose the behavior
 * - select a behavior, choose the package
 */
export class Package {
  // todo: use selected package scripts
  public static scripts: string[] = ['dev', 'start', 'build'];

  public static operations: PackageFilterType[] = [
    'self',
    'withDependencies',
    'withDependents',
    'dependenciesOnly',
    'dependentsOnly',
  ];

  public static get SelectPackage(): ICommandRegistry {
    return {
      command: 'select-workspace-package',
      callback: async (args: any) => {
        const selectedTargetPackage = await vscode.window.showQuickPick(
          Object.keys(ExtensionConfiguration.packages.read())
        );
        if (!selectedTargetPackage) {
          return;
        }

        const selectedScript = await vscode.window.showQuickPick(
          Package.scripts
        );

        if (!selectedScript) {
          return;
        }

        const selectedOperation = <PackageFilterType>(
          await vscode.window.showQuickPick(Package.operations)
        );

        if (!selectedOperation) {
          return;
        }

        Utils.Terminal.createTerminalForScriptExecution(
          selectedTargetPackage,
          selectedScript,
          selectedOperation
        );
      },
    };
  }
}
