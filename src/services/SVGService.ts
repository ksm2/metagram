export interface SVGCommand {
  cmd: string;
  args: number[];
}

export class SVGService {

  static parseSVGPathCommands(path: string): SVGCommand[] {
    const commands: SVGCommand[] = [];
    for (let i = 0; i < path.length; i += 1) {
      let args;
      switch (path[i]) {
        case ' ':
        case '\t':
        case '\n':
        case '\r':
          continue;
        case 'H':
        case 'h':
        case 'V':
        case 'v': {
          const cmd = path[i];
          [i, args] = SVGService.parseSVGPathCommand(path, i, 1);
          commands.push({ cmd, args });
          break;
        }
        case 'M':
        case 'm':
        case 'L':
        case 'l': {
          const cmd = path[i];
          [i, args] = SVGService.parseSVGPathCommand(path, i, 2);
          commands.push({ cmd, args });
          break;
        }
        case 'Z':
          i += 1;
          commands.push({ cmd: 'Z', args: [] });
        default:
          throw new Error(`Error in SVG path: Illegal character found in command arguments at pos ${i}:\n${path}\n${' '.repeat(i)}^`);
      }
    }

    return commands;
  }

  static parseSVGPathCommand(path: string, i: number, expectedCommands: number): [number, number[]] {
    i += 1;
    const results: string[] = [];
    let result = 0;
    let inArg = true;
    for (; i < path.length; i += 1) {
      switch (path[i]) {
        case ' ':
        case '\t':
        case '\n':
        case '\r':
          if (inArg) result += 1;
          inArg = false;
          if (result === expectedCommands) return [i, results.map(string => parseFloat(string))];
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '.':
        case '-':
          inArg = true;
          results[result] = results[result] || '';
          results[result] += path[i];
          break;
        default:
          throw new Error(`Error in SVG path: Illegal character found in command arguments at pos ${i}:\n${path}\n${' '.repeat(i)}^`);
      }
      if (!inArg && result == expectedCommands) break;
    }

    // Check if valid ending
    if (
      (inArg && result !== expectedCommands - 1) ||
      (!inArg && result !== expectedCommands)
    ) throw new Error(`Error in SVG path: Path is not complete ${path}`);

    return [i, results.map(string => parseFloat(string))];
  }
}
