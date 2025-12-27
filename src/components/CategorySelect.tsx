import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  placeholder?: string;
}

export default function CategorySelect({ value, onChange, categories, placeholder = 'Selecione ou digite...' }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Atualiza o filtro quando o valor muda externamente
  useEffect(() => {
    if (!isOpen) {
      setFilter(value);
    }
  }, [value, isOpen]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFilter(value); // Restaura o valor original
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  // Filtra categorias baseado no texto digitado
  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(filter.toLowerCase())
  );

  // Verifica se o texto digitado é uma nova categoria
  const isNewCategory = filter.trim() !== '' && 
    !categories.some(cat => cat.toLowerCase() === filter.toLowerCase());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setIsOpen(true);
  };

  const handleSelectCategory = (category: string) => {
    onChange(category);
    setFilter(category);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    if (filter.trim()) {
      onChange(filter.trim());
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filter.trim()) {
      e.preventDefault();
      if (filteredCategories.length === 1) {
        handleSelectCategory(filteredCategories[0]);
      } else if (isNewCategory) {
        handleCreateNew();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFilter(value);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={filter}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredCategories.length > 0 ? (
            <>
              <div className="px-3 py-2 text-xs text-gray-500 font-medium uppercase border-b">
                Categorias Existentes
              </div>
              {filteredCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition flex items-center gap-2 text-gray-700"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {category}
                </button>
              ))}
            </>
          ) : null}

          {isNewCategory && (
            <>
              {filteredCategories.length > 0 && <div className="border-t"></div>}
              <div className="px-3 py-2 text-xs text-gray-500 font-medium uppercase border-b bg-gray-50">
                Nova Categoria
              </div>
              <button
                type="button"
                onClick={handleCreateNew}
                className="w-full text-left px-4 py-2.5 hover:bg-green-50 transition flex items-center gap-2 text-green-700 font-medium"
              >
                <Plus size={16} />
                Criar "{filter}"
              </button>
            </>
          )}

          {!isNewCategory && filteredCategories.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              Nenhuma categoria encontrada
            </div>
          )}
        </div>
      )}
    </div>
  );
}
