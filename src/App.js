// src/App.js
import React, { useState, useEffect } from 'react';
import { itinerary } from './itineraryData';
import jsPDF from 'jspdf';
import './App.css';

// Componente per una singola attività
function ActivityItem({ activity, preference, onPreferenceChange }) {
  const handlePreferenceChange = (e) => {
    onPreferenceChange(activity.name, e.target.value);
  };

  return (
    <div className="activity-item">
      <span className="activity-name">
        {activity.name}
      </span>
      <div className="preference-form">
        {["0", "1", "2", "3"].map((value) => (
          <React.Fragment key={value}>
            <input
              type="radio"
              id={`${activity.name}-${value}`}
              name={activity.name}
              value={value}
              checked={preference === value}
              onChange={handlePreferenceChange}
            />
            <label htmlFor={`${activity.name}-${value}`}>{value}</label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Componente per la navigazione mobile
function MobileNav({ currentPage, onPageChange }) {
  const pages = [
    { key: 'home', title: 'Menu', icon: '🏠' },
    { key: 'Tokyo', title: 'Tokyo', icon: '🏙️' },
    { key: 'Kyōto', title: 'Kyoto', icon: '⛩️' },
    { key: 'MonteFuji e Dintorni di Tokyo', title: 'Mt.Fuji', icon: '🗻' },
    { key: 'Honshu Centrale', title: 'Honshu', icon: '🎪' }
  ];

  return (
    <nav className="mobile-nav">
      {pages.map(page => (
        <button
          key={page.key}
          className={`nav-button ${currentPage === page.key ? 'active' : ''}`}
          onClick={() => onPageChange(page.key)}
        >
          <span className="nav-icon">{page.icon}</span>
          <span className="nav-text">{page.title}</span>
        </button>
      ))}
    </nav>
  );
}

// Componente per la sezione commenti
function CommentsSection({ subcategoryKey, comment, onCommentChange }) {
  const [localComment, setLocalComment] = useState(comment || '');

  const handleSave = () => {
    onCommentChange(subcategoryKey, localComment);
  };

  const handleTextChange = (e) => {
    setLocalComment(e.target.value);
  };

  return (
    <div className="comments-section">
      <h4 className="comments-title">💭 Note personali</h4>
      <textarea
        className="comments-input"
        value={localComment}
        onChange={handleTextChange}
        placeholder="Aggiungi qui le tue note personali per questa sezione... (es. orari preferiti, preferenze speciali, ricordi da conservare)"
        rows={4}
      />
      <button 
        className="comments-save-btn"
        onClick={handleSave}
        disabled={localComment === (comment || '')}
      >
        💾 Salva note
      </button>
      {comment && (
        <p className="comments-saved-indicator">✅ Note salvate</p>
      )}
    </div>
  );
}

// Componente per la homepage/menu principale
function HomePage({ onPageChange, preferences }) {
  const categories = [
    {
      key: 'Tokyo',
      title: 'Tokyo',
      icon: '🏙️',
      description: 'Luoghi e attività a Tokyo',
      color: '#007AFF'
    },
    {
      key: 'Kyōto',
      title: 'Kyoto',
      icon: '⛩️',
      description: 'Templi e tradizioni di Kyoto',
      color: '#34C759'
    },
    {
      key: 'MonteFuji e Dintorni di Tokyo',
      title: 'Monte Fuji',
      icon: '🗻',
      description: 'Monte Fuji e dintorni',
      color: '#FF9500'
    },
    {
      key: 'Honshu Centrale',
      title: 'Honshu Centrale',
      icon: '🎪',
      description: 'Nagoya e Parco Ghibli',
      color: '#AF52DE'
    }
  ];

  const getActivityCounts = (category) => {
    if (!itinerary[category]) return { done: 0, total: 0 };
    
    let done = 0;
    let total = 0;
    
    if (Array.isArray(itinerary[category])) {
      total = itinerary[category].length;
      done = itinerary[category].filter(activity => preferences[activity.name] !== undefined).length;
    } else {
      Object.values(itinerary[category]).forEach(activities => {
        total += activities.length;
        done += activities.filter(activity => preferences[activity.name] !== undefined).length;
      });
    }
    return { done, total };
  };

  const getProgressColor = (done, total) => {
    if (total === 0) return '#8E8E93';
    const percentage = done / total;
    
    if (percentage < 0.33) return '#FF3B30'; // Rosso
    if (percentage < 0.66) return '#FF9500'; // Arancione
    if (percentage < 1) return '#FFCC00'; // Giallo
    return '#34C759'; // Verde
  };

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h2>Benvenuto nel tuo viaggio in Giappone! 🇯🇵</h2>
        <p>Seleziona una categoria per iniziare a pianificare</p>
      </div>
      
      <div className="category-grid">
        {categories.map(category => (
          <div
            key={category.key}
            className="category-card"
            onClick={() => onPageChange(category.key)}
            style={{ '--category-color': category.color }}
          >
            <div className="category-icon">{category.icon}</div>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
            <div className="category-stats">
              {(() => {
                const { done, total } = getActivityCounts(category.key);
                const color = getProgressColor(done, total);
                return (
                  <span style={{ color }}>
                    {done}/{total}
                  </span>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente per il riepilogo delle preferenze
function SummaryModal({ preferences, onClose }) {
    const sortedPreferences = Object.entries(preferences)
      .filter(([, value]) => value !== undefined)
      .sort(([, a], [, b]) => b - a);
  
    return (
      <div className="summary-modal" onClick={onClose}>
        <div className="summary-content" onClick={(e) => e.stopPropagation()}>
          <h2>Riepilogo Preferenze</h2>
          {sortedPreferences.length > 0 ? (
            sortedPreferences.map(([name, value]) => (
              <div key={name} className="summary-item">
                <strong>{name}:</strong> Punteggio {value}
              </div>
            ))
          ) : (
            <p>Non hai ancora selezionato nessuna preferenza.</p>
          )}
          <button onClick={onClose} style={{marginTop: "20px"}}>Chiudi</button>
        </div>
      </div>
    );
}

// Modal di conferma rimosso - ora usiamo il pulsante diretto nella navigazione

// Componente per una singola pagina categoria con navigazione sequenziale
function CategoryPage({ category, preferences, comments, onPreferenceChange, onCommentChange, onBack, onDownloadPdf }) {
  const [currentSubcategoryIndex, setCurrentSubcategoryIndex] = useState(0);
  const content = itinerary[category];
  
  // Se il contenuto è un array, trattalo come una singola sottocategoria
  const subcategories = Array.isArray(content) 
    ? [{ title: category, activities: content }]
    : Object.entries(content).map(([title, activities]) => ({ title, activities }));
  
  const currentSubcategory = subcategories[currentSubcategoryIndex];
  
  // Controlla se tutta la categoria è completata (tutte le sottocategorie)
  const isCategoryComplete = () => {
    return subcategories.every(subcategory => 
      subcategory.activities.every(activity => 
        preferences[activity.name] !== undefined
      )
    );
  };
  
  // Controlla se la sottocategoria corrente è completata
  const isCurrentSubcategoryComplete = () => {
    return currentSubcategory.activities.every(activity => 
      preferences[activity.name] !== undefined
    );
  };
  
  // Controlla quante attività sono completate nella sottocategoria corrente
  const getCurrentSubcategoryProgress = () => {
    const completed = currentSubcategory.activities.filter(activity => 
      preferences[activity.name] !== undefined
    ).length;
    const total = currentSubcategory.activities.length;
    return { completed, total };
  };
  
  const getProgressColor = (completed, total) => {
    if (total === 0) return '#8E8E93';
    const percentage = completed / total;
    
    if (percentage < 0.33) return '#FF3B30'; // Rosso
    if (percentage < 0.66) return '#FF9500'; // Arancione
    if (percentage < 1) return '#FFCC00'; // Giallo
    return '#34C759'; // Verde
  };
  
  const handleNext = () => {
    if (currentSubcategoryIndex < subcategories.length - 1 && isCurrentSubcategoryComplete()) {
      setCurrentSubcategoryIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentSubcategoryIndex > 0) {
      setCurrentSubcategoryIndex(prev => prev - 1);
    }
  };

  return (
    <div className="category-page">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>
          ← Indietro
        </button>
        <h2>{category}</h2>
      </div>

      {/* Progresso generale categoria */}
      <div className="subcategory-progress">
        <div className="progress-info">
          <span>Sottocategoria {currentSubcategoryIndex + 1} di {subcategories.length}</span>
          <span>{currentSubcategory.title}</span>
        </div>
        
        <div className="progress-bar">
          {subcategories.map((_, index) => (
            <div 
              key={index} 
              className={`progress-dot ${
                index === currentSubcategoryIndex ? 'active' : 
                index < currentSubcategoryIndex ? 'completed' : ''
              }`}
            />
          ))}
        </div>
      </div>

      <div className="subcategory-content">
        <h3>{currentSubcategory.title}</h3>
        
        {/* Progresso sottocategoria corrente */}
        <div className="current-subcategory-progress">
          {(() => {
            const { completed, total } = getCurrentSubcategoryProgress();
            const color = getProgressColor(completed, total);
            return (
              <div className="completion-bar-header">
                <span>Progresso</span>
                <span style={{ color }}>
                  {completed}/{total}
                </span>
              </div>
            );
          })()}
        </div>
        
        {currentSubcategory.activities.map((activity) => (
          <ActivityItem
            key={activity.name}
            activity={activity}
            preference={preferences[activity.name]}
            onPreferenceChange={onPreferenceChange}
          />
        ))}
        
        {/* Sezione commenti per la sottocategoria corrente */}
        <CommentsSection
          subcategoryKey={`${category}-${currentSubcategory.title}`}
          comment={comments[`${category}-${currentSubcategory.title}`]}
          onCommentChange={onCommentChange}
        />
        
        {/* Sezione completamento rimossa - ora il pulsante è nella navigazione */}
      </div>

      {/* Navigazione sottocategorie */}
      <div className="subcategory-navigation">
        <button 
          className="nav-btn" 
          onClick={handlePrevious}
          disabled={currentSubcategoryIndex === 0}
        >
          ← Precedente
        </button>
        
        {/* Pulsante Conferma se categoria completata */}
        {isCategoryComplete() ? (
          <button 
            className="confirm-btn"
            onClick={() => onDownloadPdf(category)}
          >
            ✅ Conferma
          </button>
        ) : (
          <div className="completion-status">
            {isCurrentSubcategoryComplete() ? (
              <span className="complete-badge">✅ Completata</span>
            ) : (
              <span className="incomplete-badge">⏳ In corso</span>
            )}
          </div>
        )}
        
        <button 
          className="nav-btn" 
          onClick={handleNext}
          disabled={
            currentSubcategoryIndex === subcategories.length - 1 || 
            !isCurrentSubcategoryComplete()
          }
        >
          Successiva →
        </button>
      </div>
    </div>
  );
}

function App() {
  const [preferences, setPreferences] = useState({});
  const [comments, setComments] = useState({});
  const [currentPage, setCurrentPage] = useState('home');
  const [showSummary, setShowSummary] = useState(false);

  // Carica preferenze e commenti salvati all'avvio
  useEffect(() => {
    const savedPreferences = localStorage.getItem('japan-trip-preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
    
    const savedComments = localStorage.getItem('japan-trip-comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  // Salva preferenze ogni volta che cambiano (solo se non è vuoto)
  useEffect(() => {
    if (Object.keys(preferences).length > 0) {
      localStorage.setItem('japan-trip-preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  // Salva commenti ogni volta che cambiano (solo se non è vuoto)
  useEffect(() => {
    if (Object.keys(comments).length > 0) {
      localStorage.setItem('japan-trip-comments', JSON.stringify(comments));
    }
  }, [comments]);

  const handlePreferenceChange = (activityName, value) => {
    setPreferences(prev => ({
      ...prev,
      [activityName]: value
    }));
  };

  const handleCommentChange = (subcategoryKey, commentText) => {
    setComments(prev => ({
      ...prev,
      [subcategoryKey]: commentText
    }));
  };

  const resetPreferences = () => {
    if (window.confirm('Sei sicuro di voler resettare tutte le preferenze? Questa azione non può essere annullata.')) {
      setPreferences({});
      localStorage.removeItem('japan-trip-preferences');
    }
  };

  const getPreferenceCount = () => {
    return Object.keys(preferences).filter(key => preferences[key] !== undefined).length;
  };

  // Funzione per pulire caratteri speciali per PDF
  const cleanTextForPdf = (text) => {
    if (!text) return '';
    
    // Sostituisci emoji comuni
    let cleanText = text
      .replace(/💭/g, 'NOTE:')
      .replace(/🌸/g, '(sakura)')
      .replace(/🗻/g, '(Mt.Fuji)')
      .replace(/⛩️/g, '(tempio)')
      .replace(/🏙️/g, '(citta)')
      .replace(/🎪/g, '(parco)');
    
    // Sostituisci caratteri accentati comuni
    const accents = {
      'à': 'a', 'è': 'e', 'é': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
      'À': 'A', 'È': 'E', 'É': 'E', 'Ì': 'I', 'Ò': 'O', 'Ù': 'U',
      'ā': 'a', 'ō': 'o', 'ū': 'u'
    };
    
    Object.keys(accents).forEach(accent => {
      cleanText = cleanText.replace(new RegExp(accent, 'g'), accents[accent]);
    });
    
    // Rimuovi altri caratteri non-ASCII rimanenti
    cleanText = cleanText.replace(/[^\u0020-\u007F]/g, '');
    
    return cleanText.trim();
  };

  // Funzione per generare e scaricare PDF
  const generateAndDownloadPdf = (categoryName) => {
    const currentDate = new Date().toLocaleDateString('it-IT');
    
    // Crea nuovo documento PDF
    const doc = new jsPDF();
    
    // Configurazione font e margini
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;
    
    // Titolo principale
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PREFERENZE DI VIAGGIO IN GIAPPONE', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    doc.setFontSize(14);
    doc.text(`Categoria: ${categoryName}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;
    
    // Raccogli preferenze per la categoria specifica
    const categoryPreferences = {};
    const categoryData = itinerary[categoryName];
    
    if (Array.isArray(categoryData)) {
      categoryData.forEach(activity => {
        if (preferences[activity.name] !== undefined) {
          if (!categoryPreferences[categoryName]) {
            categoryPreferences[categoryName] = [];
          }
          categoryPreferences[categoryName].push({
            name: activity.name,
            score: preferences[activity.name]
          });
        }
      });
    } else {
      Object.entries(categoryData).forEach(([subcategoryName, activities]) => {
        activities.forEach(activity => {
          if (preferences[activity.name] !== undefined) {
            if (!categoryPreferences[subcategoryName]) {
              categoryPreferences[subcategoryName] = [];
            }
            categoryPreferences[subcategoryName].push({
              name: activity.name,
              score: preferences[activity.name]
            });
          }
        });
      });
    }
    
    // Genera contenuto per sottocategorie
    Object.entries(categoryPreferences).forEach(([subcategoryName, activities]) => {
      // Controlla se serve nuova pagina
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Titolo sottocategoria
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(subcategoryName, margin, yPosition);
      yPosition += 10;
      
      // Lista attività
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      activities.forEach(activity => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 30;
        }
        const text = `- ${activity.name}: ${activity.score}/3`;
        doc.text(text, margin + 5, yPosition);
        yPosition += 6;
      });
      
      // Aggiungi commenti per questa sottocategoria se esistono
      const commentKey = `${categoryName}-${subcategoryName}`;
      const comment = comments[commentKey];
      if (comment && comment.trim()) {
        yPosition += 5;
        
        // Controlla se serve nuova pagina per i commenti
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('NOTE PERSONALI:', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Pulisci il commento dai caratteri speciali
        const cleanedComment = cleanTextForPdf(comment);
        
        // Dividi il commento pulito in righe per adattarlo alla pagina
        const lines = doc.splitTextToSize(cleanedComment, pageWidth - (margin * 2));
        lines.forEach(line => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 30;
          }
          doc.text(line, margin + 5, yPosition);
          yPosition += 5;
        });
      }
      
      yPosition += 5;
    });
    
    // Aggiungi riepilogo per punteggi
    const allActivities = [];
    Object.values(categoryPreferences).forEach(activities => {
      allActivities.push(...activities);
    });
    
    if (allActivities.length > 0) {
      // Controlla se serve nuova pagina per il riepilogo
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }
      
      yPosition += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RIEPILOGO PER PUNTEGGIO', margin, yPosition);
      yPosition += 15;
      
      [3, 2, 1, 0].forEach(score => {
        const activitiesWithScore = allActivities.filter(a => a.score === score);
        if (activitiesWithScore.length > 0) {
          if (yPosition > 260) {
            doc.addPage();
            yPosition = 30;
          }
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`Punteggio ${score}/3:`, margin, yPosition);
          yPosition += 8;
          
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          activitiesWithScore.forEach(activity => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 30;
            }
            doc.text(`- ${activity.name}`, margin + 5, yPosition);
            yPosition += 6;
          });
          yPosition += 5;
        }
      });
    }
    
    // Scarica il PDF
    const fileName = `preferenze-${categoryName.toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return fileName;
  };

  // Funzione per gestire il download diretto del PDF
  const handleDownloadPdf = (categoryName) => {
    try {
      const fileName = generateAndDownloadPdf(categoryName);
      
      alert(`✅ Il file PDF delle tue preferenze di ${categoryName} è stato scaricato con successo!\n\n📄 Trova il file "${fileName}" nei tuoi download.`);
    } catch (error) {
      console.error('Errore durante il download:', error);
      alert('❌ Si è verificato un errore durante il download. Riprova.');
    }
  };

  const renderCurrentPage = () => {
    if (currentPage === 'home') {
      return <HomePage onPageChange={setCurrentPage} preferences={preferences} />;
    } else if (itinerary[currentPage]) {
      return (
        <CategoryPage
          category={currentPage}
          preferences={preferences}
          comments={comments}
          onPreferenceChange={handlePreferenceChange}
          onCommentChange={handleCommentChange}
          onBack={() => setCurrentPage('home')}
          onDownloadPdf={handleDownloadPdf}
        />
      );
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🗾 Viaggio in Giappone</h1>
        <div className="header-buttons">
          <button 
            className="summary-header-button" 
            onClick={() => setShowSummary(true)}
          >
            📊 Preferenze ({getPreferenceCount()})
          </button>
          <button className="reset-button" onClick={resetPreferences}>
            🔄 Reset
          </button>
        </div>
      </header>

      <main>
        {renderCurrentPage()}
      </main>

      <MobileNav currentPage={currentPage} onPageChange={setCurrentPage} />

      {showSummary && (
        <SummaryModal 
          preferences={preferences} 
          onClose={() => setShowSummary(false)} 
        />
      )}


    </div>
  );
}

export default App;
