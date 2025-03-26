import { g } from '../../g';
import {
    Platform
} from 'react-native';
import RNSound from 'react-native-sound';
import { G } from 'react-native-svg';


export default class Sound {
    static soundOne: any;
    static soundLoop: any;
    static play(filename: string) {
        if (g.storage.soundFX) {
            if (this.soundOne === undefined || Platform.OS === 'ios')
                this.soundOne = new RNSound(filename + (Platform.OS === 'ios' ? '.mp3' : ''), RNSound.MAIN_BUNDLE, (error) => {
                    if (error) {
                        //console.log('failed to load the sound', error);
                        return;
                    }
                    // loaded successfully
                    //console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels());
                    // Play the sound with an onEnd callback
                    this.soundOne.play((success: any) => {
                        if (success) {
                            //console.log('successfully finished playing');
                        } else {
                            //console.log('playback failed due to audio decoding errors');
                        }
                    });

                });
            else {
                this.soundOne.play();
            }
        }
        //cheat click check bg sound
        // if(this.soundLoop.isPlaying() === false){
        //     this.playLoop();
        // }
    }

    //using for background music
    static playLoop() {
        let arrBgm = ['bet_bgm', 'bet_bgm1', 'bet_bgm2'];
        let filename = arrBgm[Math.floor(Math.random() * arrBgm.length)];

        if (!this.soundLoop?.isPlaying() && g.storage.soundBG)
            this.soundLoop = new RNSound(filename + (Platform.OS === 'ios' ? '.mp3' : ''), RNSound.MAIN_BUNDLE, (error) => {
                if (error) {
                    //console.log('failed to load the sound', error);
                    return;
                }
                // loaded successfully
                //console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels());
                // Play the sound with an onEnd callback
                this.soundLoop.play((success: any) => {
                    if (success) {
                        //console.log('successfully finished playing');
                    } else {
                        //console.log('playback failed due to audio decoding errors');
                    }
                });
                this.soundLoop.setVolume(0.5);
                this.soundLoop.setNumberOfLoops(-1);
            });
    }

    static stop() {
        if(g.storage.soundBG){
            this.soundLoop.stop();
            this.soundLoop.release();
        }
    }
    static pause() {
        this.soundLoop.pause();
    }
}