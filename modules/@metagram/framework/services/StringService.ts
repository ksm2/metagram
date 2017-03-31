export class StringService {
  /**
   * Plural inflector rules.
   */
  private static plural = {
    rules: new Map<RegExp, string>([
      [/(s)tatus$/i, '$1$2tatuses'],
      [/(quiz)$/i, '$1zes'],
      [/^(ox)$/i, '$1$2en'],
      [/([m|l])ouse$/i, '$1ice'],
      [/(matr|vert|ind)(ix|ex)$/i, '$1ices'],
      [/(x|ch|ss|sh)$/i, '$1es'],
      [/([^aeiouy]|qu)y$/i, '$1ies'],
      [/(hive)$/i, '$1s'],
      [/(:([^f])fe|([lr])f)$/i, '$1$2ves'],
      [/sis$/i, 'ses'],
      [/([ti])um$/i, '$1a'],
      [/(p)erson$/i, '$1eople'],
      [/(m)an$/i, '$1en'],
      [/(c)hild$/i, '$1hildren'],
      [/(f)oot$/i, '$1eet'],
      [/(buffal|her|potat|tomat|volcan)o$/i, '$1$2oes'],
      [/(alumn|bacill|cact|foc|fung|nucle|radi|stimul|syllab|termin|vir)us$/i, '$1i'],
      [/us$/i, 'uses'],
      [/(alias)$/i, '$1es'],
      [/(analys|ax|cris|test|thes)is$/i, '$1es'],
      [/s$/, 's'],
      [/^$/, ''],
      [/$/, 's'],
    ]),
    uninflected: [
      '.*[nrlm]ese',
      '.*deer',
      '.*fish',
      '.*measles',
      '.*ois',
      '.*pox',
      '.*sheep',
      'people',
      'cookie'
    ],
    irregular: {
      'atlas': 'atlases',
      'axe': 'axes',
      'beef': 'beefs',
      'brother': 'brothers',
      'cafe': 'cafes',
      'chateau': 'chateaux',
      'child': 'children',
      'cookie': 'cookies',
      'corpus': 'corpuses',
      'cow': 'cows',
      'criterion': 'criteria',
      'curriculum': 'curricula',
      'demo': 'demos',
      'domino': 'dominoes',
      'echo': 'echoes',
      'foot': 'feet',
      'fungus': 'fungi',
      'ganglion': 'ganglions',
      'genie': 'genies',
      'genus': 'genera',
      'graffito': 'graffiti',
      'hippopotamus': 'hippopotami',
      'hoof': 'hoofs',
      'human': 'humans',
      'iris': 'irises',
      'leaf': 'leaves',
      'loaf': 'loaves',
      'man': 'men',
      'medium': 'media',
      'memorandum': 'memoranda',
      'money': 'monies',
      'mongoose': 'mongooses',
      'motto': 'mottoes',
      'move': 'moves',
      'mythos': 'mythoi',
      'niche': 'niches',
      'nucleus': 'nuclei',
      'numen': 'numina',
      'occiput': 'occiputs',
      'octopus': 'octopuses',
      'opus': 'opuses',
      'ox': 'oxen',
      'penis': 'penises',
      'person': 'people',
      'plateau': 'plateaux',
      'runner-up': 'runners-up',
      'sex': 'sexes',
      'soliloquy': 'soliloquies',
      'son-in-law': 'sons-in-law',
      'syllabus': 'syllabi',
      'testis': 'testes',
      'thief': 'thieves',
      'tooth': 'teeth',
      'tornado': 'tornadoes',
      'trilby': 'trilbys',
      'turf': 'turfs',
      'volcano': 'volcanoes',
    },
    merged: {} as any,
  };

  /**
   * Singular inflector rules.
   */
  private static singular = {
    rules: new Map<RegExp, string>([
      [/(s)tatuses$/i, '$1$2tatus'],
      [/^(.*)(menu)s$/i, '$1$2'],
      [/(quiz)zes$/i, '$1'],
      [/(matr)ices$/i, '$1ix'],
      [/(vert|ind)ices$/i, '$1ex'],
      [/^(ox)en/i, '$1'],
      [/(alias)(es)*$/i, '$1'],
      [/(buffal|her|potat|tomat|volcan)oes$/i, '$1o'],
      [/(alumn|bacill|cact|foc|fung|nucle|radi|stimul|syllab|termin|viri?)i$/i, '$1us'],
      [/([ftw]ax)es/i, '$1'],
      [/(analys|ax|cris|test|thes)es$/i, '$1is'],
      [/(shoe|slave)s$/i, '$1'],
      [/(o)es$/i, '$1'],
      [/ouses$/, 'ouse'],
      [/([^a])uses$/, '$1us'],
      [/([m|l])ice$/i, '$1ouse'],
      [/(x|ch|ss|sh)es$/i, '$1'],
      [/(m)ovies$/i, '$1$2ovie'],
      [/(s)eries$/i, '$1$2eries'],
      [/([^aeiouy]|qu)ies$/i, '$1y'],
      [/([lr])ves$/i, '$1f'],
      [/(tive)s$/i, '$1'],
      [/(hive)s$/i, '$1'],
      [/(drive)s$/i, '$1'],
      [/([^fo])ves$/i, '$1fe'],
      [/(^analy)ses$/i, '$1sis'],
      [/(analy|diagno|^ba|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, '$1$2sis'],
      [/([ti])a$/i, '$1um'],
      [/(p)eople$/i, '$1$2erson'],
      [/(m)en$/i, '$1an'],
      [/(c)hildren$/i, '$1$2hild'],
      [/(f)eet$/i, '$1oot'],
      [/(n)ews$/i, '$1$2ews'],
      [/eaus$/, 'eau'],
      [/^(.*us)$/, '$1'],
      [/s$/i, ''],
    ]),
    uninflected: [
      '.*[nrlm]ese',
      '.*deer',
      '.*fish',
      '.*measles',
      '.*ois',
      '.*pox',
      '.*sheep',
      '.*ss',
    ],
    irregular: {
      'criteria': 'criterion',
      'curves': 'curve',
      'emphases': 'emphasis',
      'foes': 'foe',
      'hoaxes': 'hoax',
      'media': 'medium',
      'neuroses': 'neurosis',
      'waves': 'wave',
      'oases': 'oasis',
    },
    merged: {} as any,
  };

  /**
   * Words that should not be inflected.
   *
   * @var array
   */
  private static uninflected = [ 'Amoyese', 'bison', 'Borghese', 'bream', 'breeches',
    'britches', 'buffalo', 'cantus', 'carp', 'chassis', 'clippers', 'cod', 'coitus',
    'Congoese', 'contretemps', 'corps', 'debris', 'diabetes', 'djinn', 'eland', 'elk',
    'equipment', 'Faroese', 'flounder', 'Foochowese', 'gallows', 'Genevese', 'Genoese',
    'Gilbertese', 'graffiti', 'headquarters', 'herpes', 'hijinks', 'Hottentotese',
    'information', 'innings', 'jackanapes', 'Kiplingese', 'Kongoese', 'Lucchese',
    'mackerel', 'Maltese', '.*?media', 'mews', 'moose', 'mumps', 'Nankingese', 'news',
    'nexus', 'Niasese', 'Pekingese', 'Piedmontese', 'pincers', 'Pistoiese', 'pliers',
    'Portuguese', 'proceedings', 'rabies', 'rice', 'rhinoceros', 'salmon', 'Sarawakese',
    'scissors', 'sea[- ]bass', 'series', 'Shavese', 'shears', 'siemens', 'species',
    'staff', 'swine', 'testes', 'trousers', 'trout', 'tuna', 'Vermontese', 'Wenchowese',
    'whiting', 'wildebeest', 'Yengeese' ];

  /**
   * Returns a word in plural form
   *
   * @param word The word in singular form.
   * @return string The word in plural form.
   */
  public static pluralize(word: string): string {
    if (!StringService.plural.merged.irregular) {
      StringService.plural.merged.irregular = StringService.plural.irregular;
    }

    if (!(StringService.plural.merged.uninflected)) {
      StringService.plural.merged.uninflected = StringService.plural.uninflected.concat(StringService.uninflected);
    }

    const uninflected = new RegExp(`^(${StringService.plural.merged.uninflected.join('|')})$`, 'i');
    const irregular = new RegExp(`(.*)\\b(${Object.keys(StringService.plural.merged.irregular).join('|')})$`, 'i');

    // Apply irregular
    let $regs;
    if ($regs = word.match(irregular)) {
      return $regs[1] + word[0] + StringService.plural.merged.irregular[$regs[2].toLowerCase()].substr(1);
    }

    // Apply uninflected
    if (uninflected.exec(word)) {
      return word;
    }

    // Apply a rule
    for (let [rule, replacement] of StringService.plural.rules) {
      if (word.match(rule)) {
        return word.replace(rule, replacement);
      }
    }

    return word;
  }

  /**
   * Returns a word in singular form
   *
   * @param word The word in plural form.
   * @return string The word in singular form.
   */
  public static singularize(word: string): string {
    if (!StringService.singular.merged.uninflected) {
      StringService.singular.merged.uninflected = StringService.singular.uninflected.concat(StringService.uninflected);
    }

    if (!(StringService.singular.merged.irregular)) {
      const flip = StringService.flipObject(StringService.plural.irregular);
      StringService.singular.merged.irregular = Object.assign({}, StringService.singular.irregular, flip);
    }

    const uninflected = new RegExp(`^(${StringService.singular.merged.uninflected.join('|')})$`, 'i');
    const irregular = new RegExp(`(.*)\\b(${Object.keys(StringService.singular.merged.irregular).join('|')})$`, 'i');

    let $regs;
    if ($regs = word.match(irregular)) {
      return $regs[1] + word[0] + StringService.singular.merged.irregular[$regs[2].toLowerCase()].substr(1);
    }

    if (word.match(uninflected)) {
      return word;
    }

    for (let [rule, replacement] of StringService.singular.rules) {
      if (word.match(rule)) {
        return word.replace(rule, replacement);
      }
    }

    return word;
  }

  /**
   * Lower cases the first character of a string
   *
   * @param str The string to lower case the first letter of
   * @return The string with lower-cased first letter
   */
  static lowerCaseFirst(str: string): string {
    return `${str[0].toLowerCase()}${str.substring(1)}`;
  }

  /**
   * Upper cases the first character of a string
   *
   * @param str The string to upper case the first letter of
   * @return The string with upper-cased first letter
   */
  static upperCaseFirst(str: string): string {
    return `${str[0].toUpperCase()}${str.substring(1)}`;
  }

  /**
   * Converts a camel-cased string to a hyphen-cased one
   *
   * @param camel The camel-cased string
   * @return A hyphen-cased string
   */
  static camelToHyphenCase(camel: string): string {
    return this.lowerCaseFirst(camel).replace(/([A-Z])/g, _ => '-' + _.toLowerCase());
  }

  /**
   * Flips keys and values of an object
   */
  private static flipObject(data: any) {
    return Object.keys(data).reduce((obj, key) => Object.assign(obj, { [data[key]]: key }), {});
  }
}
