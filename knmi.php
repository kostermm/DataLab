

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
  throw new Exception("Problem with $url, $php_errormsg");
}

$response = @stream_get_contents($fp);
if ($response === false) 
{
  throw new Exception("Problem reading data from $url, $php_errormsg");
}

echo $url . $params;

echo $response;
