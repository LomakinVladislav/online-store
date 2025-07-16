import React from 'react';
import { Card } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import styles from './DeckCard.module.css';
import { IDeckData } from '@/types';
import { EditOutlined } from '@ant-design/icons'; 


const { Meta } = Card;

interface DeckCardProps {
  deck: IDeckData;
  isFavorite: boolean;
  loadingFavorite: boolean;
  isEditable: boolean;
  onToggleFavorite: (deckId: number, e: React.MouseEvent) => void;
  onClick: (deckId: number) => void;
  onEditClick?: (deckId: number) => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({
  deck, isFavorite, loadingFavorite, onToggleFavorite, onClick, isEditable, onEditClick
}) => {
  return (
    <Card
      className={styles.deckCard}
      cover={
        <div style={{ position: 'relative' }}>
          <img 
            alt={deck.title} 
            src={deck.image_url} 
            className={styles.cardImage}
          />
          <div className={styles.cardActions}>
            {isEditable && (
              <button 
                className={styles.editButton}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEditClick) onEditClick(deck.id);
                }}
              >
                <EditOutlined />
              </button>
            )}
            
            <button 
              className={styles.favoriteButton}
              onClick={(e) => onToggleFavorite(deck.id, e)}
              disabled={loadingFavorite}
            >
              {isFavorite 
                ? <HeartFilled style={{ color: '#ff4d4f' }} /> 
                : <HeartOutlined />
              }
            </button>
          </div>
        </div>
      }
      onClick={() => onClick(deck.id)}
    >
      <Meta 
        title={deck.title} 
        description={deck.description} 
      />
    </Card>
  );
};