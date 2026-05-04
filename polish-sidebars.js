const fs = require('fs');
const cnImport = "import { cn } from '@/lib/utils'";

function polishSidebar(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes(cnImport)) {
    content = content.replace("import Link from 'next/link'", "import Link from 'next/link'\n" + cnImport);
  }

  content = content.replace(
    /<SidebarMenuButton\s*\r?\n\s*asChild\s*\r?\n\s*isActive={isActive\(item\.url\)}\s*\r?\n\s*tooltip={item\.title}\s*\r?\n\s*>/g,
    `<SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "relative transition-all duration-200 group/btn px-4 h-10",
                      isActive(item.url) ? "bg-white/10 text-white font-semibold" : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >`
  );

  content = content.replace(
    /<item\.icon className="h-4 w-4" \/>\s*\r?\n\s*<span>{item\.title}<\/span>/g,
    `<item.icon className={cn(
                        "h-4 w-4 transition-colors", 
                        isActive(item.url) ? "text-primary" : "group-hover/btn:text-white"
                      )} />
                      <span>{item.title}</span>
                      {isActive(item.url) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                      )}`
  );

  fs.writeFileSync(filePath, content);
}

polishSidebar('d:\\\\AutoService\\\\frontend\\\\components\\\\admin\\\\AdminSidebar.tsx');
polishSidebar('d:\\\\AutoService\\\\frontend\\\\components\\\\gudang\\\\gudang-sidebar.tsx');
polishSidebar('d:\\\\AutoService\\\\frontend\\\\components\\\\mekanik\\\\mekanik-sidebar.tsx');
polishSidebar('d:\\\\AutoService\\\\frontend\\\\components\\\\pimpinan\\\\pimpinan-sidebar.tsx');
