import { extname, basename } from 'path';

export interface MetadataDefaults {
  title: string;
  description: string;
}

/**
 * Generate default metadata based on filename and file type
 */
export function generateDefaultMetadata(filename: string): MetadataDefaults {
  const extension = extname(filename).toLowerCase().slice(1); // Remove the dot
  const baseName = basename(filename, extname(filename));

  // Generate title from filename (remove extension, capitalize first letter, replace underscores/hyphens with spaces)
  const title = baseName
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();

  // Generate description based on file type
  const description = generateDescriptionByFileType(extension, baseName);

  return {
    title,
    description,
  };
}

/**
 * Generate description based on file extension
 */
function generateDescriptionByFileType(extension: string, baseName: string): string {
  const fileTypeDescriptions: Record<string, string> = {
    // Images
    jpg: 'Digital image file',
    jpeg: 'Digital image file',
    png: 'Digital image file with transparency support',
    gif: 'Animated image file',
    webp: 'Modern web image format',
    svg: 'Scalable vector graphics file',
    bmp: 'Bitmap image file',
    tiff: 'High-quality image file',
    ico: 'Icon file',

    // Videos
    mp4: 'Digital video file',
    avi: 'Video file',
    mov: 'QuickTime video file',
    wmv: 'Windows Media video file',
    flv: 'Flash video file',
    webm: 'Web video format',
    mkv: 'Matroska video file',
    m4v: 'MPEG-4 video file',

    // Audio
    mp3: 'Digital audio file',
    wav: 'Uncompressed audio file',
    flac: 'Lossless audio file',
    aac: 'Advanced audio codec file',
    ogg: 'Open-source audio file',
    wma: 'Windows Media audio file',
    m4a: 'MPEG-4 audio file',

    // Documents
    pdf: 'Portable document format file',
    doc: 'Microsoft Word document',
    docx: 'Microsoft Word document',
    txt: 'Plain text document',
    rtf: 'Rich text format document',
    odt: 'OpenDocument text document',

    // Spreadsheets
    xls: 'Microsoft Excel spreadsheet',
    xlsx: 'Microsoft Excel spreadsheet',
    csv: 'Comma-separated values file',
    ods: 'OpenDocument spreadsheet',

    // Presentations
    ppt: 'Microsoft PowerPoint presentation',
    pptx: 'Microsoft PowerPoint presentation',
    odp: 'OpenDocument presentation',

    // Code files
    js: 'JavaScript source code',
    ts: 'TypeScript source code',
    py: 'Python source code',
    java: 'Java source code',
    cpp: 'C++ source code',
    c: 'C source code',
    cs: 'C# source code',
    php: 'PHP source code',
    rb: 'Ruby source code',
    go: 'Go source code',
    rs: 'Rust source code',
    swift: 'Swift source code',
    kt: 'Kotlin source code',
    scala: 'Scala source code',
    r: 'R statistical computing script',
    sql: 'SQL database script',
    sh: 'Shell script',
    bat: 'Batch script',
    ps1: 'PowerShell script',

    // Web files
    html: 'HTML web page',
    htm: 'HTML web page',
    css: 'Cascading style sheet',
    scss: 'Sass stylesheet',
    less: 'Less stylesheet',
    xml: 'XML document',
    json: 'JSON data file',
    yaml: 'YAML configuration file',
    yml: 'YAML configuration file',
    toml: 'TOML configuration file',

    // Archives
    zip: 'Compressed archive file',
    rar: 'RAR archive file',
    '7z': '7-Zip archive file',
    tar: 'Tar archive file',
    gz: 'Gzip compressed file',
    bz2: 'Bzip2 compressed file',

    // 3D and Design
    blend: 'Blender 3D model file',
    obj: '3D object file',
    fbx: '3D model file',
    dae: 'Digital asset exchange file',
    stl: '3D printing model file',
    psd: 'Adobe Photoshop document',
    ai: 'Adobe Illustrator file',
    sketch: 'Sketch design file',
    fig: 'Figma design file',

    // Data files
    db: 'Database file',
    sqlite: 'SQLite database file',
    log: 'Log file',
    md: 'Markdown document',
    readme: 'README documentation file',

    // Executable files
    exe: 'Windows executable file',
    msi: 'Windows installer package',
    dmg: 'macOS disk image',
    pkg: 'macOS installer package',
    deb: 'Debian package file',
    rpm: 'Red Hat package file',
    appimage: 'Linux application image',

    // Font files
    ttf: 'TrueType font file',
    otf: 'OpenType font file',
    woff: 'Web font file',
    woff2: 'Web font file (version 2)',

    // Other common formats
    iso: 'Disk image file',
    torrent: 'BitTorrent file',
    key: 'Keynote presentation',
    numbers: 'Numbers spreadsheet',
    pages: 'Pages document',
  };

  const baseDescription = fileTypeDescriptions[extension] || 'Digital file';

  // Add contextual information based on filename patterns
  const contextualSuffix = getContextualSuffix(baseName.toLowerCase());

  return contextualSuffix ? `${baseDescription} - ${contextualSuffix}` : baseDescription;
}

/**
 * Add contextual information based on filename patterns
 */
function getContextualSuffix(baseName: string): string | null {
  // Common patterns in filenames that provide context
  const patterns: Array<{ pattern: RegExp; suffix: string }> = [
    { pattern: /test|spec/, suffix: 'test file' },
    { pattern: /config|configuration|settings/, suffix: 'configuration file' },
    { pattern: /readme|documentation|docs/, suffix: 'documentation' },
    { pattern: /license|licence/, suffix: 'license document' },
    { pattern: /changelog|changes|history/, suffix: 'change log' },
    { pattern: /package|manifest/, suffix: 'package manifest' },
    { pattern: /index|main|app/, suffix: 'main application file' },
    { pattern: /utils|utilities|helpers/, suffix: 'utility functions' },
    { pattern: /api|service|client/, suffix: 'API interface' },
    { pattern: /model|schema|types/, suffix: 'data model' },
    { pattern: /component|widget|ui/, suffix: 'user interface component' },
    { pattern: /template|layout/, suffix: 'template file' },
    { pattern: /style|theme/, suffix: 'styling file' },
    { pattern: /script|automation/, suffix: 'automation script' },
    { pattern: /backup|bak/, suffix: 'backup file' },
    { pattern: /temp|tmp/, suffix: 'temporary file' },
    { pattern: /draft|wip/, suffix: 'work in progress' },
    { pattern: /final|release|prod/, suffix: 'production version' },
    { pattern: /v\d+|version/, suffix: 'versioned file' },
    { pattern: /sample|example|demo/, suffix: 'example file' },
  ];

  for (const { pattern, suffix } of patterns) {
    if (pattern.test(baseName)) {
      return suffix;
    }
  }

  return null;
}

/**
 * Validate metadata before API calls
 */
export function validateMetadata(
  title?: string,
  description?: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Title validation
  if (title !== undefined) {
    if (title.trim().length === 0) {
      errors.push('Title cannot be empty');
    } else if (title.length > 200) {
      errors.push('Title cannot exceed 200 characters');
    } else if (title.trim() !== title) {
      errors.push('Title cannot have leading or trailing whitespace');
    }
  }

  // Description validation
  if (description !== undefined) {
    if (description.trim().length === 0) {
      errors.push('Description cannot be empty');
    } else if (description.length > 1000) {
      errors.push('Description cannot exceed 1000 characters');
    } else if (description.trim() !== description) {
      errors.push('Description cannot have leading or trailing whitespace');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Apply default metadata if not provided
 */
export function applyDefaultMetadata(
  filename: string,
  providedTitle?: string,
  providedDescription?: string
): { title: string; description: string } {
  const defaults = generateDefaultMetadata(filename);

  return {
    title: providedTitle?.trim() || defaults.title,
    description: providedDescription?.trim() || defaults.description,
  };
}
