//-----------------------------------------------------------------------------
// SRPG_EnemyExplainWindow_MZ.js
//-----------------------------------------------------------------------------
// copyright 2024 @Nisetaityo all rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc SRPGギア使用時、敵に説明ウィンドウを表示
 * @author 偽たいちょー
 * 
 * @help
 * SRPGギア使用中、敵を選択するとステータスウィンドウが表示されますが、
 * それに追加して敵の説明ウィンドウを作成できるようにします。
 *
 * 使用方法:
 * ツクールのデータベース -> 敵キャラ ->メモ欄に以下を追加
 * <explanation1:XXXXXXXXXXXXX>
 * <explanation2:XXXXXXXXXXXXX>
 * <explanation3:XXXXXXXXXXXXX>
 * <explanation4:XXXXXXXXXXXXX>
 * <explanation5:XXXXXXXXXXXXX>
 * <explanation6:XXXXXXXXXXXXX>
 * <explanation7:XXXXXXXXXXXXX>
 * <explanation8:XXXXXXXXXXXXX>
 * それぞれ、説明ウィンドウの各行を示しています。（つまり全8行表示）
 * またexplanation1が定義されていない場合は説明ウィンドウは表示されません。
 * 
 */

//====================================================================
// 初期化
//====================================================================

// 敵説明ウィンドウ
function Window_SrpgEnemyExplain() {
    this.initialize(...arguments);
}

Window_SrpgEnemyExplain.prototype = Object.create(Window_StatusBase.prototype);
Window_SrpgEnemyExplain.prototype.constructor = Window_SrpgEnemyExplain;

(function(){
    var _SRPG_Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _SRPG_Game_System_initialize.call(this);
        this._SrpgEnemyExplainWindowNeedRefreshFlag = [false, null];
    };
    
//====================================================================
// フラグ管理用
//====================================================================
    // 敵説明ウィンドウのリフレッシュフラグを返す
    Game_System.prototype.srpgEnemyExplainWindowNeedRefresh = function() {
        return this._SrpgEnemyExplainWindowNeedRefreshFlag;
    };

    // 敵説明ウィンドウのリフレッシュフラグを設定する（同時にユニットの情報を保持する）
    Game_System.prototype.setSrpgEnemyExplainWindowNeedRefresh = function(battlerArray) {
        this._SrpgEnemyExplainWindowNeedRefreshFlag = [true, battlerArray];
    };

    // 敵説明ウィンドウのリフレッシュフラグをクリアする
    Game_System.prototype.clearSrpgEnemyExplainWindowNeedRefresh = function() {
        this._SrpgEnemyExplainWindowNeedRefreshFlag = [false, null];
    };
    
//====================================================================
// ●Window_SrpgEnemyExplain
//====================================================================

    // 初期化
    Window_SrpgEnemyExplain.prototype.initialize = function(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._type = null;
        this._battler = null;
        this.refresh();
    };
    
    // ユニットのセット
    Window_SrpgEnemyExplain.prototype.setBattler = function(data) {
        this._type = data[0];
        this._battler = data[1];
        this.refresh();
    };
    
    // ユニットのクリア
    Window_SrpgEnemyExplain.prototype.clearBattler = function() {
        this._type = null;
        this._battler = null;
        this.refresh();
    };
    
    // リフレッシュ
    Window_SrpgEnemyExplain.prototype.refresh = function() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this._battler) {
            // 説明文はエネミーのみ記載
            if (this._type === 'enemy') {
                this.drawContentsEnemy(6, 0);
            }
        }
    };
    
    // エネミーの説明描画
    Window_SrpgEnemyExplain.prototype.drawContentsEnemy = function(x, y) {
        this.contents.fontSize = 20;
        const explain1 = this._battler.enemy().meta.explanation1;
        const explain2 = this._battler.enemy().meta.explanation2;
        const explain3 = this._battler.enemy().meta.explanation3;
        const explain4 = this._battler.enemy().meta.explanation4;
        const explain5 = this._battler.enemy().meta.explanation5;
        const explain6 = this._battler.enemy().meta.explanation6;
        const explain7 = this._battler.enemy().meta.explanation7;
        const explain8 = this._battler.enemy().meta.explanation8;
        if (explain1 && explain1.trim() !== '') this.drawText(explain1, x, y , 400, 'left');
        if (explain2 && explain2.trim() !== '') this.drawText(explain2, x, y + 20 , 400, 'left');
        if (explain3 && explain3.trim() !== '') this.drawText(explain3, x, y + 40 , 400, 'left');
        if (explain4 && explain4.trim() !== '') this.drawText(explain4, x, y + 60 , 400, 'left');
        if (explain5 && explain5.trim() !== '') this.drawText(explain5, x, y + 80 , 400, 'left');
        if (explain6 && explain6.trim() !== '') this.drawText(explain6, x, y + 100 , 400, 'left');
        if (explain7 && explain7.trim() !== '') this.drawText(explain7, x, y + 120 , 400, 'left');
        if (explain8 && explain8.trim() !== '') this.drawText(explain8, x, y + 140 , 400, 'left');
    };
    
//====================================================================
// ●Game_Player
//====================================================================
    // ステータスウィンドウ表示中、キャンセルキーもしくはタップされた場合に閉じる
    var _SRPG_Game_Player_triggerAction = Game_Player.prototype.triggerAction;
    Game_Player.prototype.triggerAction = function() {
        if ($gameSystem.isSRPGMode() === true) {
            if ($gameSystem.isSubBattlePhase() === 'status_window') {
                if (Input.isTriggered('cancel') || TouchInput.isTriggered() || TouchInput.isCancelled())
                    $gameSystem.clearSrpgEnemyExplainWindowNeedRefresh();
            }
        }
        return _SRPG_Game_Player_triggerAction.call(this);
    };
    
    // ユニット上で決定キーが押された場合
    var _SRPG_Game_Player_startMapEvent = Game_Player.prototype.startMapEvent;
    Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
        if ($gameSystem.isSRPGMode() === true) {
            if (!$gameMap.isEventRunning() && $gameSystem.isBattlePhase() === 'actor_phase') {
                if ($gameSystem.isSubBattlePhase() === 'normal') {
                    $gameMap.eventsXy(x, y).forEach(function(event) {
                        if (event.isTriggerIn(triggers) && !event.isErased()) {
                            // 選択されたユニットがエネミーの場合
                            if (event.isType() === 'enemy') {
                                var battlerArray = $gameSystem.EventToUnit(event.eventId());
                                $gameSystem.setSrpgEnemyExplainWindowNeedRefresh(battlerArray);
                            }
                        }
                    });
                }
            }
        }
        _SRPG_Game_Player_startMapEvent.call(this, x, y, triggers, normal);
    };
    
//====================================================================
// ●Scene_Map
//====================================================================
    var _SRPG_SceneMap_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _SRPG_SceneMap_createAllWindows.call(this);
        this.createSrpgEnemyExplainWindow();
    };
    
    // 敵説明用ウィンドウを作る
    Scene_Map.prototype.createSrpgEnemyExplainWindow = function() {
        const rect = this.srpgEnemyExplainWindowRect(true);
        this._mapSrpgEnemyExplainWindow = new Window_SrpgEnemyExplain(rect);
        this._mapSrpgEnemyExplainWindow.openness = 0;
        this.addWindow(this._mapSrpgEnemyExplainWindow);
    };

    // 敵説明用ウィンドウのrectを設定する
    Scene_Map.prototype.srpgEnemyExplainWindowRect = function(target) {
        const ww = Graphics.boxWidth / 2 - 6;
        const wh = 200;
        const wx = Graphics.boxWidth / 2 + 6;
        const wy = 400;
        return new Rectangle(wx, wy, ww, wh);
    };
    
    // マップの更新
    var _SRPG_SceneMap_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _SRPG_SceneMap_update.call(this);
        this.srpgEnemyExplainWindowOpenClose();
    };
    
    // ウィンドウの開閉
    Scene_Map.prototype.srpgEnemyExplainWindowOpenClose = function() {
        var flag = $gameSystem.srpgEnemyExplainWindowNeedRefresh();
        if (flag !== undefined && flag[0]) {
            if (!this._mapSrpgEnemyExplainWindow.isOpen() && !this._mapSrpgEnemyExplainWindow.isOpening()) {
                // explanation1がある場合はウィンドウを表示する
                const explain1 = flag[1][1].enemy().meta.explanation1;
                if (explain1 && explain1.trim() !== '') {
                    this._mapSrpgEnemyExplainWindow.setBattler(flag[1]);
                    this._mapSrpgEnemyExplainWindow.open();
                }
            }
        } else {
            if (this._mapSrpgEnemyExplainWindow.isOpen() && !this._mapSrpgEnemyExplainWindow.isClosing()) {
                this._mapSrpgEnemyExplainWindow.close();
            }
        }
        // 予想ウィンドウで敵説明文が出てしまうため問答無用で閉じる
        var flag = $gameSystem.srpgBattleWindowNeedRefresh();
        if (flag[0]) this._mapSrpgEnemyExplainWindow.close();
    };
})();