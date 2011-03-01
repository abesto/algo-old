/**
 * @package CountingSort
 * @file DetailsUI.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * Details UI for CountingSort, Hungarian version
 * Listens to signals from a CountingSort and a History instance (and handles them in the same way).
 *
 * Copyright 2011 Nagy Zoltán
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var DetailsUI = (function() {
    var messages = {
        'created': 'Ez a program az előadáson ismertetett leszámoló rendezés kicsivel általánosabb változatát demonstrálja. ' +
                   'A két különbség: 1. Nem az elemek értéke, hanem (a valós használati esetekhez hasonlóan) kulcsok ' +
                   'alapján rendezünk. 2. Nem tételezzük fel, hogy a kulcsok [0..k] intervallumon vannak, hanem megkeressük ' +
                   'a legkisebb és legnagyobb kulcsot. Itt feltesszük, hogy minden kulcs egész szám, de tetszőleges ' +
                   '(előre ismert) számtani sorozat elemei is lehetnének kulcsok.',
        'minmax': 'Párhuzamos (egy ciklussal végzett) minimum- és maximumkereséssel megtaláltuk a ' +
                  '<span class="hl1">legkisebb</span> és <span class="hl2">legnagyobb</span> kulcsot. Ennek megfelelően ' +
                  'indexelt előfordulás-számokat és edényvégeket tartalmazó tömböket veszünk fel.',
        'occurence': 'Az <span class="hl1">elem</span>eken sorban végighaladva megszámoljuk, hogy melyik ' +
                     '<span class="hl2">kulcs</span> hányszor fordul elő. ',
        'occurences_filled': '(Algoritmikailag ez nem lépés)<br />Ha ismerjük az egyes kulcsok előfordulás-számát, ' +
                             'akkor ez alapján meghatározhatjuk, hogy az egyes kulcsokhoz tartozó elemek hol fognak ' +
                             'kezdődni/végződni a rendezett tömbben. Az azonos kulcsú elemekkel feltöltött résztömböt ' +
                             'nevezzük edénynek. <br />Ebben az algoritmusban az edények végét keressük és használjuk.',
        "bin_end": '<span class="hl1">Adott edény végének indexe</span>: az <span class="hl3">előző edény végének indexe</span> +' +
                   ' <span class="hl2">az adott kulcs előfordulás-száma</span>.',
        "bin_ends_done": '(Algoritmikailag ez nem lépés)<br />Az edényvégek ismeretével már tudjuk, hogy melyik elem ' +
                         'hova fog kerülni. Az azonos kulcsú elemek sorrendjének megtartásához hátulról indulunk a ' +
                         'rendezetlen tömb elemei között.',
        'sorted': 'A <span class="hl3">{{key}:{value}} elem</span> kulcsához tartozó <span class="hl2">edényvég</span> ' +
                  '{idx1} volt, erre az indexre helyezzük az <span class="hl1">elemet</span> (másolatát, pointerét az ' +
                  'adott helyzettől függően). Ezután az edényvég értékét eggyel csökkentjük (<span class="hl2">így most ' +
                  '{idx}</span>), hogy az esetleg következő azonos kulcsú elem is megfelelő helyre kerüljön.',
        'done': 'Ezzel kulcsok szerint rendeztük az elemeket. Egyszer kellett végigmennünk a rendezetlen listán (előállítva ' +
                'az előfordulás-számok listáját), egyszer az előfordulás-számok listáján (előállítva az edényvégek listáját), ' +
                'majd egyszer az edényvégek listáján, amiből már kaptuk a rendezett tömböt.'
    };

    function setText($details, signal) {
        var txt = messages[signal.type()],  prop,
                params = signal.allParams(), $li;

        if (txt == undefined) {
            return;
        }

        for (prop in params) {
            txt = txt.replace('{' + prop + '}', params[prop]);
        }

        $details.html(txt);
    }

    return function($details, sort, history) {
        SAS.addSlot(function(signal) {
            setText($details, signal)
        }, sort.uid);


        SAS.addSlot(function(signal) {
            setText($details, signal.param('signal'));
        }, history.uid);
    }
})();
