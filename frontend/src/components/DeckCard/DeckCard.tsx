import React from 'react';
import { Card, Rate } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import styles from './DeckCard.module.css';
import { DeckCardProps } from '@/types';
import { EditOutlined } from '@ant-design/icons'; 

const { Meta } = Card;

export const DeckCard: React.FC<DeckCardProps> = ({
  deck, 
  isFavorite, 
  loadingFavorite, 
  isEditable, 
  onToggleFavorite, 
  onClick, 
  onEditClick
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
                  onEditClick?.(deck.id);
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
        description={
          <div>
            <Rate 
              disabled 
              defaultValue={deck.difficulty} 
              allowHalf 
              style={{ fontSize: 14, display: 'flex'}} 
            />
            <span className={styles.description}>{deck.description}</span>
          </div>  
        }
      />
    </Card>
  );
};