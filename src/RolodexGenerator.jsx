import React, { useState, useCallback } from "react";
import {
  Upload,
  Download,
  FileText,
  Palette,
  Smartphone,
  Database,
  Code,
  CheckCircle2,
  ArrowRight,
  Settings,
  Eye,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const RolodexGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [csvData, setCsvData] = useState(null);
  const [csvColumns, setCsvColumns] = useState([]);
  const [config, setConfig] = useState({
    appTitle: "My Resource Rolodex",
    titleColumn: "",
    descriptionColumn: "",
    categoryColumn: "",
    urlColumn: "",
    theme: "flatly",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    accentColor: "#f59e0b",
    textColor: "#ffffff",
    showSearch: true,    
    accordionItems: [
      {
        title: "",
        header: "",
        text: "",
        embedVideo: false,
        embedCode: ""
      }
    ]
  });

  const [colorTemplates] = useState([
    {
      name: "Ocean Blue",
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      accentColor: "#f59e0b",
      textColor: "#ffffff"
    },
    {
      name: "Forest Green",
      primaryColor: "#10b981",
      secondaryColor: "#059669",
      accentColor: "#34d399",
      textColor: "#ffffff"
    },
    {
      name: "Sunset",
      primaryColor: "#f97316",
      secondaryColor: "#dc2626",
      accentColor: "#fbbf24",
      textColor: "#ffffff"
    },
    {
      name: "Midnight",
      primaryColor: "#1e293b",
      secondaryColor: "#475569",
      accentColor: "#06b6d4",
      textColor: "#ffffff"
    },
    {
      name: "Rose Garden",
      primaryColor: "#e11d48",
      secondaryColor: "#be123c",
      accentColor: "#fb7185",
      textColor: "#ffffff"
    },
    {
      name: "Slate Modern",
      primaryColor: "#64748b",
      secondaryColor: "#475569",
      accentColor: "#0ea5e9",
      textColor: "#ffffff"
    }
  ]);

  const [isDownloading, setIsDownloading] = useState(false);
  
  // Converts 3-digit hex (#000) → 6-digit hex (#000000)
  const normalizeHex = (hex) => {
    if (!hex) return hex;
    // ensure it starts with #
    let h = hex.startsWith("#") ? hex : `#${hex}`;
    if (h.length === 4) {
      h =
        "#" +
        h[1] + h[1] +
        h[2] + h[2] +
        h[3] + h[3];
    }
    return h.toLowerCase();
  };


  // --- Handle CSV Upload ---
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && (file.type === "text/csv" || file.type === "text/tab-separated-values" || file.name.endsWith('.csv') || file.name.endsWith('.tsv'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        
        // Detect delimiter - check if first line has tabs or commas
        const firstLine = text.split("\n")[0];
        const delimiter = firstLine.includes('\t') ? '\t' : ',';
        
        // Proper parsing function that handles quoted fields
        const parseLine = (line, delim) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === delim && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const lines = text.split("\n").filter(line => line.trim());
        const headers = parseLine(lines[0], delimiter).map(h => h.replace(/^"|"$/g, ''));

        const rows = lines
          .slice(1)
          .map((line) => {
            const values = parseLine(line, delimiter).map(v => v.replace(/^"|"$/g, ''));
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index] || "";
              return obj;
            }, {});
          })
          .filter((row) => Object.values(row).some((val) => val));

        setCsvColumns(headers);
        setCsvData(rows);
        setCurrentStep(2);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid CSV or TSV file");
    }
  }, []);

  // --- Placeholder Code Generation ---
  const generateAppCode = () => {
    const {
      appTitle,
      titleColumn,
      descriptionColumn,
      categoryColumn,
      urlColumn,
      telephoneColumn,
      addressColumn,
      hoursColumn,
    } = config;

    return `
  library(shiny)
  library(shinyMobile)

  ui <- f7Page(
    # Add custom CSS
    tags$style(HTML("
      .toolbar {
        width: 125% !important;
      }
    ")),
    
    tags$head(
    HTML('<link rel="stylesheet" type="text/css" href="shinyMobile2.0.1.min.css">'),
    # Favicon (root or explicit path)
    tags$link(rel = "icon", type = "image/png", href = "icons/favicon.ico"),
    
    # Manifest
    tags$link(rel = "manifest", href = "manifest.json"),
    
    # Service Worker
    tags$script(HTML("
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('service-worker.js');
        });
      }
    "))
    ),
    
    title = "${appTitle}",
    options = list(dark = FALSE),
    f7TabLayout(
      navbar = f7Navbar(title = "${appTitle}"),
      f7Tabs(
        animated = TRUE,
        id = "tab",

        # Home Page Tab -----------------------------------------------------------


          f7Tab(
            tabName = "WelcomeTab",
            icon = f7Icon("house_fill"),
            active = TRUE,
            f7Block(
              f7Shadow(
                intensity = 5,
                hover = TRUE,
                f7Card(title="Welcome to ${appTitle}",
                       uiOutput("welcome"),
                       hairlines = F, strong = T, inset =
                         F, tablet = FALSE))),
            f7Block(
              f7Shadow(
                intensity = 5,
                hover = TRUE,
                f7Card(title="Adding the app to your device",
                       uiOutput("installapp"),                       
                       hairlines = F, strong = T, inset =
                         F, tablet = FALSE))),

            f7Block(
              f7Shadow(
                intensity = 5,
                hover = TRUE,
                f7Card(title=NULL,
                       f7Button(inputId ="helppopup", label = "Quick Introduction", color= "darkorchid3", fill=T, shadow=T, rounded = T, size = "large"),
                       hairlines = F, strong = T, inset =
                         F, tablet = FALSE))),

          ),

        # Search Tab -----------------------------------------------------------
        f7Tab(
          tabName = "Resources",
          icon = f7Icon("search"),
          active = TRUE,

          f7Shadow(
            intensity = 5,
            hover = TRUE,
            f7Card(
              title = "Select a resource category below",
              uiOutput("selector"),
            )
          ),

          uiOutput("accordions")
        )
      )
    )
  )

  server <- function(input, output, session) {
    resources <- read.csv("rolodex.csv", stringsAsFactors = FALSE)

    observeEvent(input$helppopup, {
          f7Popup(id="NewUserintro1", title= f7Align(h3("Quick Introduction"), side=c("center")), swipeToClose = T, closeButton = T,
                  f7Block(
                    f7Shadow(
                      intensity = 30,
                      hover = F,
                      f7Card(f7BlockHeader(text="Navigating the ${appTitle} App"),
                            f7Align(h4("Use the buttons at the bottom of the screen to navigate between tabs"), side=c("center")),
                            hairlines = F, strong = T, inset =
                              F, tablet = FALSE))),
                  f7Block(
                    f7Shadow(
                      intensity = 30,
                      hover = F,
                      f7Card(f7BlockHeader(text="What do the buttons do?"),
                            h5(f7Icon("house_fill"),"- Return home"),
                            h5(f7Icon("search"),"- Browse resources"),
                            hairlines = F, strong = T, inset =
                              F, tablet = FALSE)),
                    br(),
                    br(),
                    br(),
                    br(),
                    br(),
                    br(),
                    f7BlockFooter(f7Align(h4("Swipe up to close this popup"), side=c("center"))))
      )
    })

    output$selector <- renderUI({
      tagList(
        div(
          class = "resource-select-wrapper",
          f7Select(
            inputId = "category",
            label = NULL,
            choices = sort(unique(resources$Type)),
            selected = NULL
          )
        )
      )
    })

    output$accordions <- renderUI({
      req(input$category)
      items <- subset(resources, Type == input$category)
      if (nrow(items) == 0) return(NULL)
      f7Card(
      br(),
      f7Accordion(
        id = paste0("acc_", gsub("\\\\s", "_", input$category)),
        multiCollapse = TRUE,
        lapply(seq_len(nrow(items)), function(i) {
          f7AccordionItem(
            title = items[i, "Name"],
            f7Block(
              tagList(
                if ("Address" %in% names(items)) items[i, "Address"],
                if ("Phone" %in% names(items)) br(),
                if ("Phone" %in% names(items)) f7Link(href = paste0(items[i, "Phone"]), label = "Call Now"),
                if ("Hours" %in% names(items)) br(),
                if ("Hours" %in% names(items)) items[i, "Hours"],
                if ("Website" %in% names(items)) br(),
                if ("Website" %in% names(items)) f7Link(href = items[i, "Website"], label = items[i, "Website"]),
                br(), br(),
                if ("Info" %in% names(items)) items[i, "Info"]
              )
            )
          )
        })
      ),
      br(),
      )
    })

  # Install App Instructions Card -------------------------------------------
    output$installapp <- renderUI({
      tagList(
      f7Accordion(id=NULL,
                  f7AccordionItem(title = "iPhone", open=F, multiCollapse=F,
                                  f7Block(br(),
                                          h4("Step 1: Open the website in Safari"),
                                          h4("Step 2: Tap the share button", f7Icon("square_arrow_up"), "at the bottom of the screen"),
                                          h4("Step 3: Scroll down and click 'Add to Home Screen'"),
                                          h4("Step 4: Find the ACCESS app on your homescreen and open up the app"),
                                          f7Align(div(f7Link("Instructions with screenshots", href="https://www.cdc.gov/niosh/mining/content/hearingloss/installPWA.html")),side=c("center")))),


                  f7AccordionItem(title = "Android", open=F, multiCollapse=F,
                                  f7Block(br(),
                                          h4("Step 1: Open the website in Chrome"),
                                          h4("Step 2: Tap the menu in the upper right corner of the screen"),
                                          h4("Step 3: Scroll down and click 'Add to Home Screen', change the name to 'ACCESS'"),
                                          h4("Step 4: Find the ACCESS app on your homescreen and open up the app"),
                                          f7Align(div(f7Link("Instructions with screenshots", href="https://www.cdc.gov/niosh/mining/content/hearingloss/installPWA.html")),side=c("center"))

                                          )))

  )
  })

    output$welcome <- renderUI({
        tagList(
          f7Accordion(
            id = NULL,
            multiCollapse = TRUE,
            ${config.accordionItems.map((item, i) => `
            f7AccordionItem(
              title = "${item.title || `Accordion ${i + 1}`}",
              f7Block(
                tagList(
                  ${item.header ? `h3("${item.header}"),` : ''}
                  ${item.text ? `p("${item.text}"),` : ''}
                  ${item.embedVideo && item.embedCode ? `HTML('${item.embedCode.replace(/'/g, "\\'")}')` : ''}
                )
              )
            )${i < config.accordionItems.length - 1 ? ',' : ''}`).join('')}
          )
        )
      })
    

  }

  shinyApp(ui, server)
  `;
  };

  const downloadApp = async () => {
    try {
      setIsDownloading(true); // start loading
      
      const zip = new JSZip();
      const folder = zip.folder("Rolodex App");

      // 1. Add app.R (generated)
      const code = generateAppCode();
      folder.file("app.R", code);

      // 2. Add Docker Build.txt & Dockerfile.txt
      const dockerBuild = await fetch("/rolodex_generator/Docker Build.txt").then(r => r.text());
      folder.file("Docker Build.txt", dockerBuild);

      const dockerFile = await fetch("/rolodex_generator/Dockerfile.txt").then(r => r.text());
      folder.file("Dockerfile.txt", dockerFile);

      // 3. Add README
      const readmeContent = await fetch("/rolodex_generator/IMPORTANT - README.html").then(r => r.text());
      folder.file("IMPORTANT - README.html", readmeContent);

      // 4. Add www/ folder contents
      const wwwFolder = folder.folder("www");

      // --- CSS with color replacements ---
      const cssContent = await fetch("/rolodex_generator/www/shinyMobile2.0.1.min.css").then(r => r.text());
      const normalizedConfig = {
        ...config,
        primaryColor: normalizeHex(config.primaryColor),
        secondaryColor: normalizeHex(config.secondaryColor),
        accentColor: normalizeHex(config.accentColor),
        textColor: normalizeHex(config.textColor),
      };
      const modifiedCss = cssContent
        .replace(/#46166B/gi, normalizedConfig.primaryColor)
        .replace(/#5B2F7B/gi, normalizedConfig.secondaryColor)
        .replace(/#EEB211/gi, normalizedConfig.accentColor)
        .replace(/#EEB221/gi, normalizedConfig.accentColor)
        .replace(/#123456/gi, normalizedConfig.textColor);

      wwwFolder.file("shinyMobile2.0.1.min.css", modifiedCss);

      // --- Other top-level www files ---
      const topLevelFiles = ["manifest.json", "service-worker.js"];
      for (const file of topLevelFiles) {
        try {
          const data = await fetch(`/rolodex_generator/www/${file}`).then(r => r.blob());
          wwwFolder.file(file, data);
        } catch (err) {
          console.warn(`Could not load /rolodex_generator/www/${file}:`, err);
        }
      }

      // --- icons subfolder ---
      const iconsFolder = wwwFolder.folder("icons");
      const iconFiles = [
        "apple-touch-icon.png",
        "favicon.ico",
        "favicon.png",
        "icon-144.png",
        "shortcut"
      ];
      for (const file of iconFiles) {
        try {
          const data = await fetch(`/rolodex_generator/www/icons/${file}`).then(r => r.blob());
          iconsFolder.file(file, data);
        } catch (err) {
          console.warn(`Could not load /rolodex_generator/www/icons/${file}:`, err);
        }
      }

      // Generate and trigger download
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Rolodex_App.zip");
    } catch (err) {
      console.error("Error generating ZIP:", err);
      alert("Something went wrong while preparing your app.");
    } finally {
      setIsDownloading(false);
    }
  };



  const steps = [
    { number: 1, title: "Upload Data", icon: Upload, description: "Import your CSV file" },
    { number: 2, title: "Map Fields", icon: Database, description: "Configure data columns" },
    { number: 3, title: "Home Screen", icon: Smartphone, description: "Welcome your users" },
    { number: 4, title: "Customize", icon: Palette, description: "Style your app" },
    { number: 5, title: "Generate", icon: Code, description: "Download your app" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Resource Rolodex Generator
            </h1>
            <p className="mt-3 text-gray-600 text-lg font-light">
              Transform your CSV data into a beautiful shinyMobile Rolodex Application
            </p>
            <p className="mt-3 text-gray-600 text-lg font-light">
              <a 
                href="https://ualbanyprojectaccess.shinyapps.io/rolodex" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                Example Rolodex App
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isLast = index === steps.length - 1;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center group">
                    <div
                      className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                          : isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-white border-2 border-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={22} className="text-white" />
                      ) : (
                        <Icon size={22} />
                      )}
                      {isActive && (
                        <div className="absolute -inset-1 bg-blue-600 rounded-full animate-pulse opacity-20"></div>
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <p
                        className={`text-sm font-semibold transition-colors ${
                          isActive
                            ? "text-blue-600"
                            : isCompleted
                            ? "text-emerald-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 max-w-24">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {!isLast && (
                    <div className="flex-1 mx-8 mb-8">
                      <div
                        className={`h-0.5 transition-colors duration-500 ${
                          isCompleted ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Step 1: Upload */}
          {currentStep === 1 && (
            <div className="p-12">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Upload Your CSV File
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Start by uploading a CSV file with your data. The first row should contain column headers.
                </p>
                <p className="text-sm text-blue-600 underline">
                  <a href="rolodex_generator/rolodex.csv" download>
                    Download example CSV (use same columns and coding)
                  </a>
                </p>
              </div>

              <div className="max-w-lg mx-auto">
                <label className="group relative block">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center transition-all duration-200 group-hover:border-blue-400 group-hover:bg-blue-50/50">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop your file here, or browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports CSV files up to 10MB
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {currentStep === 2 && csvData && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-xl mb-4">
                  <Database className="w-7 h-7 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Map Your Data Columns
                </h2>
                <p className="text-gray-600">
                  Tell us which columns contain your titles, descriptions, and other data
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                {/* Data Preview */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Data Preview
                  </h3>
                  <div className="bg-white rounded-lg border overflow-x-auto">
                    <table className="min-w-max text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {csvColumns.map((col, idx) => (
                            <th
                              key={idx}
                              className="px-4 py-3 text-left font-medium text-gray-700 border-b"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 3).map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0">
                            {csvColumns.map((col, colIdx) => (
                              <td key={colIdx} className="px-4 py-3 text-gray-600">
                                {row[col] || "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Column Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: "titleColumn", label: "Resource Name Column", desc: "Main heading for each item" },
                    { key: "addressColumn", label: "Physical Address Column", desc: "Links to resources" },
                    { key: "telephoneColumn", label: "Telephone Number Column", desc: "Links to resources" },
                    { key: "urlColumn", label: "Website Column", desc: "Links to resources" },
                    { key: "hoursColumn", label: "Operating Hours Column", desc: "Links to resources" },
                    { key: "categoryColumn", label: "Category Column", desc: "For filtering and grouping" },
                    { key: "descriptionColumn", label: "Description Column", desc: "Detailed information" },
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="block">
                        <span className="text-sm font-semibold text-gray-700">{field.label}</span>
                        <span className="block text-xs text-gray-500 mb-2">{field.desc}</span>
                        <select
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={config[field.key]}
                          onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                        >
                          <option value="">Select column...</option>
                          {csvColumns.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!config.titleColumn}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Build HomeScreen */}
          {currentStep === 3 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-xl mb-4">
                  <Settings className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Customize Your Home Screen
                </h2>
                <p className="text-gray-600">Configure the home screen of your app</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
                {/* App Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Application Title
                  </label>
                  <input
                    type="text"
                    value={config.appTitle}
                    onChange={(e) => setConfig({ ...config, appTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="My Resource Hub"
                  />
                </div>

                {/* Accordion Settings */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Accordion Items (max 5)
                  </label>
                  <select
                    value={config.accordionItems?.length || 2}
                    onChange={(e) => {
                      const count = parseInt(e.target.value, 10);
                      const newItems = Array.from({ length: count }, (_, i) => 
                        config.accordionItems?.[i] || {
                          title: "",
                          header: "",
                          text: "",
                          embedVideo: false,
                          embedCode: ""
                        }
                      );
                      setConfig({ ...config, accordionItems: newItems });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Render Accordion Item Inputs */}
                {config.accordionItems?.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-4">
                    <h4 className="font-semibold text-gray-800">
                      Accordion Item {index + 1}
                    </h4>

                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...config.accordionItems];
                        updated[index].title = e.target.value;
                        setConfig({ ...config, accordionItems: updated });
                      }}
                      placeholder="Accordion Title"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />

                    <input
                      type="text"
                      value={item.header}
                      onChange={(e) => {
                        const updated = [...config.accordionItems];
                        updated[index].header = e.target.value;
                        setConfig({ ...config, accordionItems: updated });
                      }}
                      placeholder="Header"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />

                    <textarea
                      value={item.text}
                      onChange={(e) => {
                        const updated = [...config.accordionItems];
                        updated[index].text = e.target.value;
                        setConfig({ ...config, accordionItems: updated });
                      }}
                      placeholder="Text Content"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.embedVideo}
                        onChange={(e) => {
                          const updated = [...config.accordionItems];
                          updated[index].embedVideo = e.target.checked;
                          setConfig({ ...config, accordionItems: updated });
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Embed YouTube Video</span>
                    </label>

                    {item.embedVideo && (
                      <input
                        type="text"
                        value={item.embedCode}
                        onChange={(e) => {
                          const updated = [...config.accordionItems];
                          updated[index].embedCode = e.target.value;
                          setConfig({ ...config, accordionItems: updated });
                        }}
                        placeholder="Paste YouTube embed code"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    )}
                  </div>
                ))}

                {/* Colors */}
                {/* (keep your color customization code here) */}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Style App
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Step 4: Customization */}
          {currentStep === 4 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-xl mb-4">
                  <Settings className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Customize Your App
                </h2>
                <p className="text-gray-600">
                  Configure the appearance and features of your Shiny application
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
              {/* Color Template Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose a Color Template (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {colorTemplates.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => setConfig({
                        ...config,
                        primaryColor: template.primaryColor,
                        secondaryColor: template.secondaryColor,
                        accentColor: template.accentColor,
                        textColor: template.textColor
                      })}
                      className="relative p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-all group"
                    >
                      <div className="flex space-x-1 mb-2">
                        <div 
                          className="w-6 h-6 rounded" 
                          style={{ backgroundColor: template.primaryColor }}
                        />
                        <div 
                          className="w-6 h-6 rounded" 
                          style={{ backgroundColor: template.secondaryColor }}
                        />
                        <div 
                          className="w-6 h-6 rounded" 
                          style={{ backgroundColor: template.accentColor }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {template.name}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Or customize colors manually below
                </p>
              </div>

              <div className="border-t pt-6"></div>
                {/* App Title
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Application Title
                  </label>
                  <input
                    type="text"
                    value={config.appTitle}
                    onChange={(e) => setConfig({ ...config, appTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="My Resource Hub"
                  />
                </div> */}

                
                {/* Color Customization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: normalizeHex(e.target.value) })}
                        className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: normalizeHex(e.target.value) })}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => setConfig({ ...config, secondaryColor: normalizeHex(e.target.value) })}
                        className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.secondaryColor}
                        onChange={(e) => setConfig({ ...config, secondaryColor: normalizeHex(e.target.value) })}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Accent Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => setConfig({ ...config, accentColor: normalizeHex(e.target.value) })}
                        className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.accentColor}
                        onChange={(e) => setConfig({ ...config, accentColor: normalizeHex(e.target.value) })}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Text Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={config.textColor}
                          onChange={(e) => setConfig({ ...config, textColor: normalizeHex(e.target.value) })}
                          className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.textColor}
                          onChange={(e) => setConfig({ ...config, textColor: normalizeHex(e.target.value) })}
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                  </div>

                </div>



                {/* Features */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Features
                  </label>
                  <div className="space-y-3">
                    {[
                      { key: "showSearch", label: "Enable Search", desc: "Allow users to search through items" },
                    ].map((feature) => (
                      <label key={feature.key} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config[feature.key]}
                          onChange={(e) => setConfig({ ...config, [feature.key]: e.target.checked })}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                          <p className="text-xs text-gray-500">{feature.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Generate App
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Generate */}
          {currentStep === 5 && (
            <div className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your App is Ready!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your Shiny application has been generated successfully. Download the R file to get started.
                </p>
                <p className="text-gray-600 mb-8">
                  Name your csv "rolodex.csv" and make sure it is in the same directory as your app's .R file
                </p>
                <button
                  onClick={downloadApp}
                  disabled={isDownloading}
                  className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all
                    ${isDownloading 
                      ? "bg-gray-400 text-white cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  {isDownloading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Preparing your app...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download App
                    </>
                  )}
                </button>
                <div className="mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                  >
                    Create Another App
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolodexGenerator;