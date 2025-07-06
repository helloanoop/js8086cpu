class CPU16 {
  constructor(memory) {
    this.memory = memory;

    this.registers = {
      AX: 0x0000,
      BX: 0x0000,
      CX: 0x0000,
      DX: 0x0000,
      SP: 0xFFFE,
      BP: 0x0000,
      SI: 0x0000,
      DI: 0x0000
    };

    this.segments = {
      CS: 0x0000,
      DS: 0x0000,
      SS: 0x0000,
      ES: 0x0000
    };

    this.IP = 0x0000;

    this.flags = {
      ZF: 0,
      CF: 0,
      SF: 0
    }

    this.halted = false;
  }

  step() {
    if(this.halted) {
      return;
    }

    const address = (this.segments.CS << 4) + this.IP;
    const opCode = this.memory.readByte(address);
    this.IP = (this.IP + 1) & 0xFFFF;

    this.execute(opCode);
  }

  execute(opCode) {
    switch(opCode) {
      // MOV AX, imm16
      case 0xB8: {
        this.registers.AX = this.fetchWord();
        break;
      }

      default:
        throw new Error(`Unknown opcode: ${opcode.toString(16)}`);
    }
  }

  fetchByte() {
    const address = (this.segments.CS << 4) + this.IP;
    const byte = this.memory.readByte(address);
    this.IP = (this.IP + 1) & 0xFFFF;
    return byte;
  }

  fetchWord() {
    const lo = this.fetchByte();
    const hi = this.fetchByte();

    return (hi << 8) | lo;
  }
}

module.exports = CPU16;
