import React, { useState, useCallback } from "react";
import {
  Upload,
  Download,
  FileText,
  Palette,
  Database,
  Code,
  CheckCircle2,
  ArrowRight,
  Settings,
  Eye,
} from "lucide-react";

const RolodexGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [csvData, setCsvData] = useState(null);
  const [csvColumns, setCsvColumns] = useState([]);
  const [config, setConfig] = useState({
    appTitle: "My Resource Hub",
    titleColumn: "",
    descriptionColumn: "",
    categoryColumn: "",
    urlColumn: "",
    theme: "flatly",
    primaryColor: "#2563eb",
    secondaryColor: "#10b981",
    showSearch: true,
    showFilters: true,
  });

  const themes = [
    "cerulean", "cosmo", "cyborg", "darkly", "flatly", "journal",
    "litera", "lumen", "lux", "materia", "minty", "morph",
    "pulse", "quartz", "sandstone", "simplex", "sketchy",
    "slate", "solar", "spacelab", "superhero", "united", "vapor", "yeti"
  ];

  // --- Handle CSV Upload ---
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split("\n");
        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().replace(/"/g, ""));

        const rows = lines
          .slice(1, 6)
          .map((line) => {
            const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
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
      alert("Please upload a valid CSV file");
    }
  }, []);

  // --- Placeholder Code Generation ---
  const generateAppCode = () => `# Shiny app code placeholder`;

  const downloadApp = () => {
    const code = generateAppCode();
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.appTitle.toLowerCase().replace(/\s+/g, "_")}_app.R`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const steps = [
    { number: 1, title: "Upload Data", icon: Upload, description: "Import your CSV file" },
    { number: 2, title: "Map Fields", icon: Database, description: "Configure data columns" },
    { number: 3, title: "Customize", icon: Palette, description: "Style your app" },
    { number: 4, title: "Generate", icon: Code, description: "Download your app" },
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
                <p className="text-gray-600 max-w-md mx-auto">
                  Start by uploading a CSV file with your data. The first row should contain column headers.
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
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {csvColumns.slice(0, 4).map((col, idx) => (
                            <th key={idx} className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                              {col}
                            </th>
                          ))}
                          {csvColumns.length > 4 && (
                            <th className="px-4 py-3 text-left font-medium text-gray-500">
                              +{csvColumns.length - 4} more
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 3).map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0">
                            {csvColumns.slice(0, 4).map((col, colIdx) => (
                              <td key={colIdx} className="px-4 py-3 text-gray-600">
                                {row[col] || "—"}
                              </td>
                            ))}
                            {csvColumns.length > 4 && (
                              <td className="px-4 py-3 text-gray-400">...</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Column Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: "titleColumn", label: "Title Column", desc: "Main heading for each item" },
                    { key: "descriptionColumn", label: "Description Column", desc: "Detailed information" },
                    { key: "categoryColumn", label: "Category Column", desc: "For filtering and grouping" },
                    { key: "urlColumn", label: "URL Column", desc: "Links to resources" },
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

          {/* Step 3: Customization */}
          {currentStep === 3 && (
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

                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Bootstrap Theme
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {themes.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setConfig({ ...config, theme })}
                        className={`px-3 py-2 text-xs font-medium rounded-md border transition-all ${
                          config.theme === theme
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

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
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
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
                        onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                        className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.secondaryColor}
                        onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
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
                      { key: "showFilters", label: "Enable Filters", desc: "Add category filtering options" },
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
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Generate App
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Generate */}
          {currentStep === 4 && (
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
                <button
                  onClick={downloadApp}
                  className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Download className="mr-3 w-5 h-5" />
                  Download App
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