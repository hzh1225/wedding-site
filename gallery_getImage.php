<?php
header("Content-Type: application/json");

$category = isset($_GET['category']) ? $_GET['category'] : '';
$directory = __DIR__ . "/image_gar/" . $category . "/"; // 確保使用正確的目錄路徑

if (!is_dir($directory)) {
    echo json_encode(["error" => "資料夾不存在: " . $directory]);
    exit;
}

// 檢查目錄是否可讀取
if (!is_readable($directory)) {
    echo json_encode(["error" => "資料夾無法讀取，請確認權限: " . $directory]);
    exit;
}

$files = array_values(array_diff(scandir($directory), array('.', '..'))); // 讀取資料夾
$imageFiles = [];

foreach ($files as $file) {
    $filePath = "image_gar/" . $category . "/" . $file;
    if (is_file($directory . $file) && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
        $imageFiles[] = $filePath; // 確保回傳的是相對路徑
    }
}

// 如果沒有找到圖片，回傳錯誤訊息
if (empty($imageFiles)) {
    echo json_encode(["error" => "資料夾內沒有可用的圖片"]);
    exit;
}

$files = scandir($directory);
echo json_encode(["debug_files" => $files]); // 顯示所有檔案
exit;

echo json_encode($imageFiles);

?>
