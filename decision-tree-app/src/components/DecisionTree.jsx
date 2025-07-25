import React, { useState } from 'react';
import treeData from '../data/tree.json';
import styles from './DecisionButton.module.css';

const containerStyle = {
  maxWidth: '480px',
  width: '100%',
  margin: '0 auto',
  padding: '1rem',
  boxSizing: 'border-box',
};


const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  marginBottom: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

function getNode(id) {
  return treeData.find((n) => n.id === id);
}

const DecisionTree = () => {
  const [history, setHistory] = useState([1]);
  const [calcValues, setCalcValues] = useState({ power: '', hours: '', price: '' });
  const [calcResult, setCalcResult] = useState(null);

  const currentId = history[history.length - 1];
  const node = getNode(currentId);

  const handleOption = (next) => {
    setHistory((h) => [...h, next]);
    setCalcValues({ power: '', hours: '', price: '' });
    setCalcResult(null);
  };

  const handleBack = () => {
    if (calcResult !== null && node.type === 'calculator') {
      setCalcResult(null);
    } else if (history.length > 1) {
      setHistory((h) => h.slice(0, -1));
      setCalcValues({ power: '', hours: '', price: '' });
      setCalcResult(null);
    }
  };

  const handleCalc = () => {
    const power = parseFloat(calcValues.power) || 0;
    const hours = parseFloat(calcValues.hours) || 0;
    const price = parseFloat(calcValues.price) || 0;
    const result = power * hours * price;
    setCalcResult(result);
  };

  return (
    <div style={containerStyle} key={node ? node.id : 'root'} className="fade">
      {node && (
        <div>
          {node.question && <p style={{ fontSize: '18px', marginBottom: '10px' }}>{node.question}</p>}

          {/* Calculator Node */}
          {node.type === 'calculator' && (
            <div>
              {calcResult === null && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="number"
                      placeholder="توان مورد نیاز (کیلووات)"
                      style={inputStyle}
                      value={calcValues.power}
                      onChange={(e) => setCalcValues({ ...calcValues, power: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="مدت استفاده روزانه (ساعت)"
                      style={inputStyle}
                      value={calcValues.hours}
                      onChange={(e) => setCalcValues({ ...calcValues, hours: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="قیمت هر کیلووات‌ساعت (ریال)"
                      style={inputStyle}
                      value={calcValues.price}
                      onChange={(e) => setCalcValues({ ...calcValues, price: e.target.value })}
                    />
                  </div>
                  <button className={styles.decisionButton} onClick={handleCalc}>
                    <span>محاسبه</span>
                    <span className="arrow">←</span>
                  </button>
                </div>
              )}
              {calcResult !== null && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>
                    هزینه تقریبی: {calcResult.toLocaleString()} ریال
                  </p>
                  {node.options &&
                    node.options.map((opt, idx) => (
                      <button
                        key={idx}
                        className={styles.decisionButton}
                        onClick={() => handleOption(opt.next)}
                      >
                        <span>{opt.label}</span>
                        <span className="arrow">←</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Regular Node */}
          {node.type !== 'calculator' && node.options && (
            <div>
              {node.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={styles.decisionButton}
                  onClick={() => handleOption(opt.next)}
                >
                  <span>{opt.label}</span>
                  <span className="arrow">←</span>
                </button>
              ))}
            </div>
          )}

          {/* Back Button */}
          <button
            className={styles.decisionButton}
            onClick={handleBack}
            disabled={history.length === 1 && calcResult === null}
          >
            بازگشت
          </button>
        </div>
      )}
    </div>
  );
};

export default DecisionTree;
