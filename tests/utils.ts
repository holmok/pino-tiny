import Sinon, { SinonSandbox } from 'sinon'

export function pre (): SinonSandbox {
  return Sinon.createSandbox()
}

export function post (sandbox: SinonSandbox): void {
  sandbox.verifyAndRestore()
}
