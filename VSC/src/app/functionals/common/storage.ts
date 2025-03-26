import AsyncStorage from '@react-native-async-storage/async-storage';
import { g } from 'app/g';
import { G } from 'react-native-svg';

class Storage {
    private readonly key = '@key_v211106';
    private data = {
        username: '',
        pass: '',
        sound: true,
        soundFX: true,
        lastTimeRefresh : '2021-01-01T13:10:41.734Z',
        popupTetShowed:'',
        notiCount: 0,
        notiHotMatch: 0,
        notiMessage: 0,
        notiReaded:''
    }
    constructor() {
        this.read();
    }
    private async write() {
        try {
            const json = JSON.stringify(this.data);
            await AsyncStorage.setItem(this.key, json);
        } catch (e) {
        }
    }
    private async read() {
        try {
            const json = await AsyncStorage.getItem(this.key);
            if (json) {
                this.data = JSON.parse(json);
            }
        } catch (e) {
        }
    }
    set user({ username, pass }: { username: string, pass: string }) {
        this.data.username = username;
        this.data.pass = pass;
        this.write();
    }
    get user() {
        const { username, pass } = this.data;
        return { username, pass };
    }

    set lastRefresh({lastTimeRefresh}:{lastTimeRefresh: string}){
        this.data.lastTimeRefresh = lastTimeRefresh;
    }

    get lastRefresh(){
        const { lastTimeRefresh } = this.data;
        return { lastTimeRefresh };
    }

    set soundBG(value: boolean) {
        this.data.sound = value;
        this.write();
    }
    get soundBG() {
        return this.data.sound ;
    }
    set soundFX(value: any) {
        this.data.soundFX = value;
        this.write();
    }
    get soundFX() {
        return this.data.soundFX;
    }

    set popupTetShowed(value: string){
        this.data.popupTetShowed = value;
        this.write();
    }
    get popupTetShowed(){
        return this.data.popupTetShowed;
    }

    set totalCount(value: number){
        this.data.notiCount = value;
        this.write();
    }
    get totalCount(){
        return this.data.notiCount;
    }
    set notiHotMatch(value: number){
        this.data.notiHotMatch = value;
        this.write();
    }
    get notiHotMatch(){
        return this.data.notiHotMatch;
    }
    set notiMessage(value: number){
        this.data.notiMessage = value;
        this.write();
    }
    get notiMessage(){
        return this.data.notiMessage;
    }
    
    set notiReaded(value: string){
        this.data.notiReaded = value;
        this.write();
    }
    get notiReaded(){
        return this.data.notiReaded||'';
    }
}

export default new Storage();