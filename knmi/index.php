

<?php
$url = 'http://projects.knmi.nl/klimatologie/daggegevens/getdata_dag.cgi';
$params = 'stns=260&vars=TN:TG:TX&byear=2018&bmonth=1&bday=2&eyear=2018&emonth=4&eday=18';

foreach($_REQUEST as $key => $val)
{
  switch($key)
    {
        case 'bday':
        case 'bmonth':
        case 'byear':
        case 'eday':
        case 'emonth':
        case 'eyear':
          $params = $key . '=' . $val . '&' . $params;
          break;
       default: // do nothing for now
          break;
    }

}

# $csv = file_get_contents($url . $params);

$postParams = array('http' => array(
  'method' => 'POST',
  'content' => $params
));

$ctx = stream_context_create($postParams);
$fp = @fopen($url, 'rb', false, $ctx);
if (!$fp)
{
  throw new Exception('Problem with $url, $php_errormsg');
}

$response = @stream_get_contents($fp);
if ($response === false) 
{
  throw new Exception('Problem reading data from $url, $php_errormsg');
}

// # 
// # STN,YYYYMMDD,   TN,   TG,   TX
// # 
// 260,20180101,   52,   68,   88
// 260,20180102,   45,   65,   91

// Split by new line
$arrLines = explode( PHP_EOL, $response);
// var_dump($arrLines);

$searchHeader = ' STN,';
$newLine = "\r\n"; // double quoted to interpret as newline!!
$strData = "";

// echo '#start#' . $newLine;
foreach($arrLines as $line) { 
  if ($line[0] == '#') {
    // echo strpos($line, 'STN,');
    // strpos ( string $haystack , mixed $needle [, int $offset = 0 ] )
    $searchPos = strpos($line, $searchHeader);
    if ( $searchPos > 0 ) {
      $strData .= trim(substr($line, $searchPos  ), ' ') . $newLine;
    }
  } elseif ( trim($line) != '' ) {
    $strData .= trim($line, ' ') . $newLine;
  }
}
// echo '#end#' . $newLine;
// echo $url . $params . PHP_EOL;

echo $strData;
