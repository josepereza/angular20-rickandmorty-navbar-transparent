import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
 import { Observable, forkJoin, of } from 'rxjs';
        import { map, catchError, switchMap } from 'rxjs/operators';
 // Interfaces
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

        interface ApiResponse {
            info: {
                count: number;
                pages: number;
                next: string | null;
                prev: string | null;
            };
            results: Character[];
        }
@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {
  private readonly API_BASE_URL = 'https://rickandmortyapi.com/api';
            private http = inject(HttpClient);

            /**
             * Obtiene todos los personajes de todas las páginas
             */
            getAllCharacters(): Observable<Character[]> {
                return this.http.get<ApiResponse>(`${this.API_BASE_URL}/character`).pipe(
                map(response => response.results),

                       catchError(this.handleError<Character[]>('getAllCharacters'))
                );
            }

            /**
             * Obtiene una página específica de personajes
             */
            getCharactersByPage(page: number): Observable<Character[]> {
                return this.http.get<ApiResponse>(`${this.API_BASE_URL}/character?page=${page}`).pipe(
                    map(response => response.results),
                    catchError(this.handleError<Character[]>('getCharactersByPage', []))
                );
            }

            /**
             * Busca personajes por nombre
             */
             searchCharactersByName(name: string): Observable<Character[]> {
                if (!name.trim()) {
                    return this.getAllCharacters();
                }
                
                return this.http.get<ApiResponse>(`${this.API_BASE_URL}/character/?name=${encodeURIComponent(name)}`).pipe(
                    map(response => response.results),
                    catchError(this.handleError<Character[]>('searchCharactersByName'))
                );
            }
 
            /**
             * Obtiene un personaje específico por ID
             */
            getCharacterById(id: number): Observable<Character> {
                return this.http.get<Character>(`${this.API_BASE_URL}/character/${id}`).pipe(
                    catchError(this.handleError<Character>('getCharacterById'))
                );
            }

            /**
             * Obtiene múltiples personajes por IDs
             */
            getMultipleCharacters(ids: number[]): Observable<Character[]> {
                const idsString = ids.join(',');
                return this.http.get<Character[]>(`${this.API_BASE_URL}/character/${idsString}`).pipe(
                    catchError(this.handleError<Character[]>('getMultipleCharacters', []))
                );
            }

            /**
             * Obtiene información general de la API
             */
            private getApiInfo(): Observable<ApiResponse['info']> {
                return this.http.get<ApiResponse>(`${this.API_BASE_URL}/character`).pipe(
                    map(response => response.info),
                    catchError(this.handleError<ApiResponse['info']>('getApiInfo'))
                );
            }

            /**
             * Crea las peticiones para todas las páginas
             */
            private createPageRequests(totalPages: number): Observable<Character[]>[] {
                const requests: Observable<Character[]>[] = [];
                
                for (let page = 1; page <= totalPages; page++) {
                    requests.push(this.getCharactersByPage(page));
                }
                
                return requests;
            }

            /**
             * Aplana el array de arrays de personajes
             */
            private flattenCharacterArrays(characterArrays: Character[][]): Character[] {
                const flattened: Character[] = [];
                
                for (const characters of characterArrays) {
                    flattened.push(...characters);
                }
                
                return flattened;
            }

            /**
             * Maneja errores de las peticiones HTTP
             */
            private handleError<T>(operation = 'operation', result?: T) {
                return (error: any): Observable<T> => {
                    console.error(`${operation} failed:`, error);
                    
                    // Aquí podrías agregar logging a un servicio externo
                    this.logError(operation, error);
                    
                    // Retorna un resultado vacío para que la app continue funcionando
                    return of(result as T);
                };
            }

            /**
             * Log de errores (aquí podrías integrar con un servicio de logging)
             */
            private logError(operation: string, error: any): void {
                const errorMessage = {
                    operation,
                    error: error.message || error,
                    timestamp: new Date().toISOString(),
                    url: error.url || 'unknown'
                };
                
                // En producción, aquí enviarías a un servicio de logging
                console.error('API Error:', errorMessage);
            }
}
