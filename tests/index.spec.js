const CPU16 = require('../src/index');
const createMockMemory = () => {
  const memory = new Uint8Array(0x10000); // 64KB flat memory
  return {
    readByte: (addr) => memory[addr & 0xFFFF],
    writeByte: (addr, value) => {
      memory[addr & 0xFFFF] = value & 0xFF;
    },
    readWord: (addr) => {
      const lo = memory[addr & 0xFFFF];
      const hi = memory[(addr + 1) & 0xFFFF];
      return (hi << 8) | lo;
    },
    writeWord: (addr, value) => {
      memory[addr & 0xFFFF] = value & 0xFF;
      memory[(addr + 1) & 0xFFFF] = (value >> 8) & 0xFF;
    },
    load: (addr, bytes) => {
      bytes.forEach((b, i) => memory[(addr + i) & 0xFFFF] = b);
    }
  };
};

test('MOV AX, imm16 loads correct immediate value', () => {
  const memory = createMockMemory();

  // Place instruction: MOV AX, 0x1234
  memory.load(0x0000, [0xB8, 0x34, 0x12]); // 0x1234 = imm16

  const cpu = new CPU16(memory);
  cpu.segments.CS = 0x0000;
  cpu.IP = 0x0000;

  cpu.step();

  expect(cpu.registers.AX).toBe(0x1234);
  expect(cpu.IP).toBe(0x0003); // Advanced 3 bytes
});