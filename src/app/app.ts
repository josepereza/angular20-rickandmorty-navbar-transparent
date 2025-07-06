import { Component, computed, effect, inject, signal } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgClass} from '@angular/common';
import { RickAndMortyService } from './services/rick-and-morty-service';
import { NavbarComponent } from './components/navbar/navbar';
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
      name: string;
      url: string;
  };
  location: {
      name: string;
      url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

// Interface para la respuesta de la API
interface ApiResponse {
  info: {
      count: number;
      pages: number;
      next: string | null;
      prev: string | null;
  };
  results: Character[];}
@Component({
  selector: 'app-root',
  imports: [NgClass, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'angular20-rickandomorty';

    private rickAndMortyService = inject(RickAndMortyService);
            
            // Signals para el estado de la aplicación
            characters = signal<Character[]>([]);
            loading = signal(true);
            error = signal<string | null>(null);
            searchTerm = signal('');

            // Computed signal para filtrar personajes
            filteredCharacters = computed(() => {
                const term = this.searchTerm().toLowerCase().trim();
                if (!term) {
                    return this.characters();
                }
                
                return this.characters().filter(character => 
                    character.name.toLowerCase().includes(term)
                );
            });

            constructor() {
                // Effect para cargar datos iniciales
                effect(() => {
                    this.loadCharacters();
                });
            }

            // Método para cargar personajes usando el servicio
            loadCharacters() {
                this.loading.set(true);
                this.error.set(null);

                this.rickAndMortyService.getAllCharacters().subscribe({
                    next: (characters) => {
                        this.characters.set(characters);
                        this.loading.set(false);
                    },
                    error: (err) => {
                        console.error('Error loading characters:', err);
                        this.error.set('No se pudieron cargar los personajes. Verifica tu conexión a internet.');
                        this.loading.set(false);
                    }
                });
            }

            // Método para manejar la entrada de búsqueda
            onSearchInput(event: Event) {
                const target = event.target as HTMLInputElement;
                this.searchTerm.set(target.value);
            }

            // Método para traducir el estado
            getStatusText(status: string): string {
                switch (status.toLowerCase()) {
                    case 'alive': return 'Vivo';
                    case 'dead': return 'Muerto';
                    case 'unknown': return 'Desconocido';
                    default: return status;
                }
            }

            // Método para traducir el género
            getGenderText(gender: string): string {
                switch (gender.toLowerCase()) {
                    case 'male': return 'Masculino';
                    case 'female': return 'Femenino';
                    case 'genderless': return 'Sin género';
                    case 'unknown': return 'Desconocido';
                    default: return gender;
                }
            }
}
