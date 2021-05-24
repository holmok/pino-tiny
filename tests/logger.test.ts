import Test from 'tape'
import { pre, post } from './utils'
import Transformer from '../src/transformer'
import Logger from '../src/logger'
import utils from '../src/utils'
import { ReadStream, WriteStream } from 'tty'
import { Stream } from 'pump'

Test('logger.prettier (object) happy path', (t): void => {
  const sandbox = pre()

  const entry = 'entry'
  const createEntryStub = sandbox.stub(Transformer.prototype, 'createEntry').returns(entry)

  const logger = new Logger()
  const prettier = logger.prettier()
  const output = prettier({ data: true })

  t.ok(createEntryStub.called, 'transformer.createEntry() called')
  t.equal(entry, output, 'got entry as output')

  post(sandbox)
  t.pass('success')
  t.end()
})

Test('logger.prettier (string) happy path', (t): void => {
  const sandbox = pre()

  const entry = 'entry'
  const createEntryStub = sandbox.stub(Transformer.prototype, 'createEntry').returns(entry)

  const logger = new Logger()
  const prettier = logger.prettier()
  const output = prettier('test')

  t.ok(createEntryStub.called, 'transformer.createEntry() called')
  t.equal(entry, output, 'got entry as output')

  post(sandbox)
  t.pass('success')
  t.end()
})

Test('logger.start  happy path', (t): void => {
  const sandbox = pre()

  const pumpStreamStub: unknown = sandbox.createStubInstance(WriteStream)
  const pumpStub = sandbox.stub(utils, 'pump').returns(pumpStreamStub as Stream)
  const splitStub = sandbox.stub(utils, 'split')
  const streamStub = sandbox.stub(Transformer.prototype, 'getStream')

  const readStub: unknown = sandbox.createStubInstance(ReadStream)
  const writeStub: unknown = sandbox.createStubInstance(WriteStream)

  const logger = new Logger()
  /* tslint:disable-next-line */
  logger.start(readStub as ReadStream, writeStub as WriteStream)

  t.ok(pumpStub.called, 'pump() called')
  t.ok(splitStub.called, 'split() called')
  t.ok(streamStub.called, 'transformer.stream() called')

  post(sandbox)
  t.pass('success')
  t.end()
})
