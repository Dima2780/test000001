// Minecraft Mod Creator - JavaScript

// Global mod data object
const modData = {
    basic: {
        name: '',
        id: '',
        version: '1.0.0',
        description: '',
        author: '',
        minecraftVersion: '1.20.4',
        loader: 'forge'
    },
    items: [],
    blocks: [],
    mobs: []
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeForms();
    initializeButtons();
    updatePreview();
});

// Tab Navigation
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Update preview when switching to export tab
            if (tabId === 'export') {
                updatePreview();
            }
        });
    });
}

// Form Initializations
function initializeForms() {
    // Basic Info Form
    const basicForm = document.getElementById('basic-form');
    const basicInputs = basicForm.querySelectorAll('input, textarea, select');
    
    basicInputs.forEach(input => {
        input.addEventListener('input', updateBasicInfo);
    });
    
    // Item Form
    const itemForm = document.getElementById('item-form');
    itemForm.addEventListener('submit', addItem);
    
    // Block Form
    const blockForm = document.getElementById('block-form');
    blockForm.addEventListener('submit', addBlock);
    
    // Mob Form
    const mobForm = document.getElementById('mob-form');
    mobForm.addEventListener('submit', addMob);
}

// Button Initializations
function initializeButtons() {
    // Download JSON
    document.getElementById('btn-download-json').addEventListener('click', downloadJSON);
    
    // Download Forge
    document.getElementById('btn-download-forge').addEventListener('click', () => downloadMod('forge'));
    
    // Download Fabric
    document.getElementById('btn-download-fabric').addEventListener('click', () => downloadMod('fabric'));
    
    // Copy JSON
    document.getElementById('btn-copy').addEventListener('click', copyJSON);
}

// Update Basic Info
function updateBasicInfo() {
    modData.basic.name = document.getElementById('mod-name').value;
    modData.basic.id = document.getElementById('mod-id').value;
    modData.basic.version = document.getElementById('mod-version').value;
    modData.basic.description = document.getElementById('mod-description').value;
    modData.basic.author = document.getElementById('mod-author').value;
    modData.basic.minecraftVersion = document.getElementById('minecraft-version').value;
    modData.basic.loader = document.getElementById('mod-loader').value;
    
    updatePreview();
}

// Add Item
function addItem(e) {
    e.preventDefault();
    
    const item = {
        name: document.getElementById('item-name').value,
        id: document.getElementById('item-id').value,
        type: document.getElementById('item-type').value,
        material: document.getElementById('item-material').value,
        damage: parseInt(document.getElementById('item-damage').value),
        durability: parseInt(document.getElementById('item-durability').value),
        stackSize: parseInt(document.getElementById('item-stack').value),
        texture: document.getElementById('item-texture').value,
        lore: document.getElementById('item-lore').value
    };
    
    if (!item.name || !item.id) {
        showNotification('Название и ID предмета обязательны!', 'error');
        return;
    }
    
    modData.items.push(item);
    renderItems();
    itemForm.reset();
    showNotification('Предмет добавлен!');
    updatePreview();
}

// Render Items
function renderItems() {
    const container = document.getElementById('items-container');
    
    if (modData.items.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><p>Пока нет созданных предметов</p></div>';
        return;
    }
    
    container.innerHTML = modData.items.map((item, index) => `
        <div class="item-card">
            <h4>${item.name}</h4>
            <p><strong>ID:</strong> ${item.id}</p>
            <p><strong>Тип:</strong> ${translateType(item.type)}</p>
            <p><strong>Материал:</strong> ${translateMaterial(item.material)}</p>
            <div class="stats">
                <span class="stat-badge">⚔️ Урон: ${item.damage}</span>
                <span class="stat-badge">❤️ Прочность: ${item.durability}</span>
                <span class="stat-badge">📦 Стак: ${item.stackSize}</span>
            </div>
            ${item.lore ? `<p><em>"${item.lore}"</em></p>` : ''}
            <button class="delete-btn" onclick="deleteItem(${index})">🗑️ Удалить</button>
        </div>
    `).join('');
}

// Delete Item
function deleteItem(index) {
    modData.items.splice(index, 1);
    renderItems();
    updatePreview();
    showNotification('Предмет удален!');
}

// Add Block
function addBlock(e) {
    e.preventDefault();
    
    const block = {
        name: document.getElementById('block-name').value,
        id: document.getElementById('block-id').value,
        type: document.getElementById('block-type').value,
        material: document.getElementById('block-material').value,
        hardness: parseFloat(document.getElementById('block-hardness').value),
        resistance: parseFloat(document.getElementById('block-resistance').value),
        lightLevel: parseInt(document.getElementById('block-light').value),
        texture: document.getElementById('block-texture').value,
        soundType: document.getElementById('block-sound').value
    };
    
    if (!block.name || !block.id) {
        showNotification('Название и ID блока обязательны!', 'error');
        return;
    }
    
    modData.blocks.push(block);
    renderBlocks();
    blockForm.reset();
    showNotification('Блок добавлен!');
    updatePreview();
}

// Render Blocks
function renderBlocks() {
    const container = document.getElementById('blocks-container');
    
    if (modData.blocks.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🧱</div><p>Пока нет созданных блоков</p></div>';
        return;
    }
    
    container.innerHTML = modData.blocks.map((block, index) => `
        <div class="block-card">
            <h4>${block.name}</h4>
            <p><strong>ID:</strong> ${block.id}</p>
            <p><strong>Тип:</strong> ${translateBlockType(block.type)}</p>
            <p><strong>Материал:</strong> ${translateMaterial(block.material)}</p>
            <div class="stats">
                <span class="stat-badge">💪 Твердость: ${block.hardness}</span>
                <span class="stat-badge">🛡️ Сопротивление: ${block.resistance}</span>
                <span class="stat-badge">💡 Свет: ${block.lightLevel}</span>
            </div>
            <button class="delete-btn" onclick="deleteBlock(${index})">🗑️ Удалить</button>
        </div>
    `).join('');
}

// Delete Block
function deleteBlock(index) {
    modData.blocks.splice(index, 1);
    renderBlocks();
    updatePreview();
    showNotification('Блок удален!');
}

// Add Mob
function addMob(e) {
    e.preventDefault();
    
    const drops = document.getElementById('mob-drops').value
        .split(',')
        .map(d => d.trim())
        .filter(d => d);
    
    const abilities = document.getElementById('mob-abilities').value
        .split(',')
        .map(a => a.trim())
        .filter(a => a);
    
    const mob = {
        name: document.getElementById('mob-name').value,
        id: document.getElementById('mob-id').value,
        type: document.getElementById('mob-type').value,
        category: document.getElementById('mob-category').value,
        health: parseFloat(document.getElementById('mob-health').value),
        damage: parseFloat(document.getElementById('mob-damage').value),
        speed: parseFloat(document.getElementById('mob-speed').value),
        width: parseFloat(document.getElementById('mob-width').value),
        height: parseFloat(document.getElementById('mob-height').value),
        texture: document.getElementById('mob-texture').value,
        drops: drops,
        abilities: abilities
    };
    
    if (!mob.name || !mob.id) {
        showNotification('Название и ID моба обязательны!', 'error');
        return;
    }
    
    modData.mobs.push(mob);
    renderMobs();
    mobForm.reset();
    showNotification('Моб добавлен!');
    updatePreview();
}

// Render Mobs
function renderMobs() {
    const container = document.getElementById('mobs-container');
    
    if (modData.mobs.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👾</div><p>Пока нет созданных мобов</p></div>';
        return;
    }
    
    container.innerHTML = modData.mobs.map((mob, index) => `
        <div class="mob-card">
            <h4>${mob.name}</h4>
            <p><strong>ID:</strong> ${mob.id}</p>
            <p><strong>Тип:</strong> ${translateMobType(mob.type)}</p>
            <p><strong>Категория:</strong> ${translateMobCategory(mob.category)}</p>
            <div class="stats">
                <span class="stat-badge">❤️ Здоровье: ${mob.health}</span>
                <span class="stat-badge">⚔️ Урон: ${mob.damage}</span>
                <span class="stat-badge">🏃 Скорость: ${mob.speed}</span>
                <span class="stat-badge">📐 Размер: ${mob.width}x${mob.height}</span>
            </div>
            ${mob.drops.length > 0 ? `<p><strong>Дроп:</strong> ${mob.drops.join(', ')}</p>` : ''}
            ${mob.abilities.length > 0 ? `<p><strong>Способности:</strong> ${mob.abilities.join(', ')}</p>` : ''}
            <button class="delete-btn" onclick="deleteMob(${index})">🗑️ Удалить</button>
        </div>
    `).join('');
}

// Delete Mob
function deleteMob(index) {
    modData.mobs.splice(index, 1);
    renderMobs();
    updatePreview();
    showNotification('Моб удален!');
}

// Update Preview
function updatePreview() {
    const preview = document.getElementById('json-preview');
    preview.textContent = JSON.stringify(modData, null, 2);
}

// Download JSON
function downloadJSON() {
    const dataStr = JSON.stringify(modData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modData.basic.id || 'my_mod'}_mod.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('JSON файл скачан!');
}

// Download Mod (Forge/Fabric)
function downloadMod(loader) {
    let fileContent = '';
    let fileName = `${modData.basic.id || 'my_mod'}_${loader}`;
    let fileType = '.txt';
    
    if (loader === 'forge') {
        fileContent = generateForgeFiles();
        fileName += '_forge';
    } else if (loader === 'fabric') {
        fileContent = generateFabricFiles();
        fileName += '_fabric';
    }
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + fileType;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`Файлы для ${loader.toUpperCase()} скачаны!`);
}

// Generate Forge Files
function generateForgeFiles() {
    const mod = modData.basic;
    
    let content = `=== MOD CONFIGURATION FOR FORGE ===\n\n`;
    content += `MOD INFO:\n`;
    content += `  Name: ${mod.name}\n`;
    content += `  ID: ${mod.id}\n`;
    content += `  Version: ${mod.version}\n`;
    content += `  Author: ${mod.author}\n`;
    content += `  Description: ${mod.description}\n`;
    content += `  Minecraft Version: ${mod.minecraftVersion}\n`;
    content += `  Loader: Forge\n\n`;
    
    content += `ITEMS (${modData.items.length}):\n`;
    modData.items.forEach(item => {
        content += `  - ${item.name} (${item.id})\n`;
        content += `    Type: ${item.type}, Material: ${item.material}\n`;
        content += `    Damage: ${item.damage}, Durability: ${item.durability}\n`;
    });
    
    content += `\nBLOCKS (${modData.blocks.length}):\n`;
    modData.blocks.forEach(block => {
        content += `  - ${block.name} (${block.id})\n`;
        content += `    Type: ${block.type}, Material: ${block.material}\n`;
        content += `    Hardness: ${block.hardness}, Resistance: ${block.resistance}\n`;
    });
    
    content += `\nMOBS (${modData.mobs.length}):\n`;
    modData.mobs.forEach(mob => {
        content += `  - ${mob.name} (${mob.id})\n`;
        content += `    Type: ${mob.type}, Category: ${mob.category}\n`;
        content += `    Health: ${mob.health}, Damage: ${mob.damage}\n`;
    });
    
    content += `\n\n=== INSTALLATION INSTRUCTIONS ===\n`;
    content += `1. Install Minecraft Forge for version ${mod.minecraftVersion}\n`;
    content += `2. Create a new mod project using the Forge MDK\n`;
    content += `3. Copy the configuration above to your mod's main class\n`;
    content += `4. Build the mod using Gradle\n`;
    content += `5. Place the resulting JAR file in the mods folder\n`;
    
    return content;
}

// Generate Fabric Files
function generateFabricFiles() {
    const mod = modData.basic;
    
    let content = `=== MOD CONFIGURATION FOR FABRIC ===\n\n`;
    content += `MOD INFO:\n`;
    content += `  Name: ${mod.name}\n`;
    content += `  ID: ${mod.id}\n`;
    content += `  Version: ${mod.version}\n`;
    content += `  Author: ${mod.author}\n`;
    content += `  Description: ${mod.description}\n`;
    content += `  Minecraft Version: ${mod.minecraftVersion}\n`;
    content += `  Loader: Fabric\n\n`;
    
    content += `ITEMS (${modData.items.length}):\n`;
    modData.items.forEach(item => {
        content += `  - ${item.name} (${item.id})\n`;
        content += `    Type: ${item.type}, Material: ${item.material}\n`;
        content += `    Damage: ${item.damage}, Durability: ${item.durability}\n`;
    });
    
    content += `\nBLOCKS (${modData.blocks.length}):\n`;
    modData.blocks.forEach(block => {
        content += `  - ${block.name} (${block.id})\n`;
        content += `    Type: ${block.type}, Material: ${block.material}\n`;
        content += `    Hardness: ${block.hardness}, Resistance: ${block.resistance}\n`;
    });
    
    content += `\nMOBS (${modData.mobs.length}):\n`;
    modData.mobs.forEach(mob => {
        content += `  - ${mob.name} (${mob.id})\n`;
        content += `    Type: ${mob.type}, Category: ${mob.category}\n`;
        content += `    Health: ${mob.health}, Damage: ${mob.damage}\n`;
    });
    
    content += `\n\n=== INSTALLATION INSTRUCTIONS ===\n`;
    content += `1. Install Fabric Loader for version ${mod.minecraftVersion}\n`;
    content += `2. Create a new mod project using Fabric Example Mod\n`;
    content += `3. Copy the configuration above to your mod's main class\n`;
    content += `4. Build the mod using Gradle\n`;
    content += `5. Place the resulting JAR file in the mods folder\n`;
    
    return content;
}

// Copy JSON to Clipboard
async function copyJSON() {
    const dataStr = JSON.stringify(modData, null, 2);
    
    try {
        await navigator.clipboard.writeText(dataStr);
        showNotification('JSON скопирован в буфер обмена!');
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = dataStr;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('JSON скопирован в буфер обмена!');
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Translation Functions
function translateType(type) {
    const types = {
        tool: 'Инструмент',
        weapon: 'Оружие',
        armor: 'Броня',
        material: 'Материал',
        food: 'Еда',
        misc: 'Разное'
    };
    return types[type] || type;
}

function translateBlockType(type) {
    const types = {
        solid: 'Твердый',
        liquid: 'Жидкость',
        ore: 'Руда',
        decorative: 'Декоративный',
        functional: 'Функциональный',
        redstone: 'Редстоун'
    };
    return types[type] || type;
}

function translateMobType(type) {
    const types = {
        passive: 'Мирный',
        neutral: 'Нейтральный',
        hostile: 'Враждебный',
        boss: 'Босс'
    };
    return types[type] || type;
}

function translateMobCategory(category) {
    const categories = {
        monster: 'Монстр',
        animal: 'Животное',
        water: 'Водный',
        ambient: 'Атмосферный',
        misc: 'Разное'
    };
    return categories[category] || category;
}

function translateMaterial(material) {
    const materials = {
        wood: 'Дерево',
        stone: 'Камень',
        iron: 'Железо',
        gold: 'Золото',
        diamond: 'Алмаз',
        netherite: 'Незерит',
        metal: 'Металл',
        glass: 'Стекло',
        cloth: 'Ткань',
        grass: 'Трава',
        sand: 'Песок',
        snow: 'Снег',
        custom: 'Свой'
    };
    return materials[material] || material;
}

// Make functions globally available
window.deleteItem = deleteItem;
window.deleteBlock = deleteBlock;
window.deleteMob = deleteMob;
