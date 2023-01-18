import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ApolloClientOptions, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PersonComponent } from './components/person/person.component';
import { PersonsComponent } from './components/persons/persons.component';
import { FilterPerson } from './components/persons/filter-person/filter-person.component';
import { FormsModule } from '@angular/forms';
import { CreatePersonComponent } from './components/person/create-person/create-person.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonsComponent,
    PersonComponent,
    FilterPerson,
    CreatePersonComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApolloModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink): ApolloClientOptions<any> {
        const http = httpLink.create({ uri: 'http://localhost:4000/graphql' });
        const ws = new GraphQLWsLink(
          createClient({
            url: 'ws://localhost:4000/graphql',
          })
        );
        const link = split(
          ({ query }) => {
            const data = getMainDefinition(query);
            return (
              data.kind === 'OperationDefinition' &&
              data.operation === 'subscription'
            );
          },
          ws,
          http
        );
        return {
          link,
          cache: new InMemoryCache({
            addTypename: false,
            typePolicies: {
              Query: {
                fields: {
                  people: {
                    merge(existing, incoming) {
                      return incoming;
                    },
                  },
                },
              },
            },
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
