#!/bin/bash


SRCDIR=/home/data/narule/markdown/      # markdown 文件上传位置
DLENGTH=${#SRCDIR}                      # markdown根路径文件夹的长度，后面生成html文件需要用到
MARKDOWNDIR=markdown

BLOGDIR=blog/html                       # html文件夹

JSON=/home/data/narule/blog/json/blog.json #文章统计信息存放处
temp=/home/data/narule/blog/json/temp

GIT_REP=/home/data/git/narule.github.io/_posts/  #同步到github的文件夹

CUTNAME=^^
flag_h=-
# inotifywait -mr --timefmt '%d/%m/%y %H:%M' --format '%T %w %f %e' -e create,delete,close_write,attrib,moved_to $SRCDIR  >> /var/log/narule_change.log


inotifywait -mqr --timefmt '%d/%m/%y %H:%M' --format '%T %w %e %f' -e 'create,delete,modify,moved_from,moved_to' $SRCDIR  | while read DATE TIME DIR EVENT FILE; do

echo "EVENT-: ${EVENT}"
echo "DIR-: ${DIR}"
echo "FILE-: ${FILE}"

curday=`date +%Y-%m-%d`


NEWDIR="${DIR/$MARKDOWNDIR/$BLOGDIR}"
NEWFILE="${FILE/%.md/.html}"

# if json file is null   init value -> {}
if [[ ! -s ${JSON} ]];then   
    	echo "file in null"
	echo '{}' > ${JSON}
fi

if [[ $EVENT == "CREATE,ISDIR" ]]; 
	then 
	NEWDIR="${NEWDIR}${FILE}"
	mkdir -p "${NEWDIR}"
elif [[ $EVENT == "MODIFY,ISDIR" ]];
	then
	NEWDIR="${NEWDIR}${FILE}"
	mkdir -p "$NEWDIR}"
elif [[ $EVENT == "DELETE,ISDIR" ]];
	then
	NEWDIR="${NEWDIR}${FILE}"
        rm -rf  "${NEWDIR}"
        INDEX="${NEWDIR:22}"
        INDEX="${INDEX////\".\"}"   # .note. -> "."note"."
        INDEX="${INDEX:1}\""   # "."note"."  -> ."note"."
        JQS="del(${INDEX})"
        cat $JSON | jq ''${JQS}'' > $temp
        if [[ -s ${temp} ]];then  # if file is not null
                cp -f $temp $JSON
        fi

elif  [[ $EVENT == "CREATE" ]];then
	if [[ $FILE == *.md ]];then
	markdown2html-converter -f "${DIR}${FILE}" -o "${NEWDIR}${NEWFILE}"
	INDEX="${NEWDIR:22}"
	INDEX="${INDEX////\".\"}"   # .note. -> "."note"."
	INDEX="${INDEX:1}"   # "."note"."  -> ."note"."
	JSONKEY="${FILE/%.md/_html}"
	JSONKEY="${JSONKEY//./_}\""  # article_html -> artcile_html"
	JSONKEY="${JSONKEY// /--}"
	CREATE_TIME="${JSONKEY:0:10}"
	TITLE="${NEWFILE%.*}"
	if echo $CREATE_TIME | grep -Eq "[0-9]{4}-[0-9]{2}-[0-9]{2}" && date -d $CREATE_TIME +%Y%m%d > /dev/null 2>&1
  		then
		MDTIME=$CREATE_TIME
		TITLE="${TITLE:11}"
	else
		MDTIME="0"
		CREATE_TIME="${curday}"
	fi;
	#TITLE="${NEWFILE%.*}"
	#TITLE="${TITLE##*-}"
	TITLE="${TITLE// /--}"
	if [[ $TITLE == *$CUTNAME* ]];
	then	
		FIRST_TITLE="${TITLE%${CUTNAME}*}"
		EN_TITLE="${TITLE##*${CUTNAME}}"
		VALUE="{title:\""${FIRST_TITLE}"\",md_time:\"${MDTIME}\",create_time:\""${CREATE_TIME}"\",update_time:\""${curday}"\",en_title:\""${EN_TITLE}"\"}"
	else
		VALUE="{title:\""${TITLE}"\",md_time:\"${MDTIME}\",create_time:\""${CREATE_TIME}"\",update_time:\""${curday}"\"}"
	fi
	INDEX="${INDEX}${JSONKEY}"
	echo "index-: ${INDEX}"
	echo "value-: ${VALUE}"
	JQS="${INDEX}=${VALUE}"
	cat $JSON | jq  ''${JQS}''  > $temp
	if [[ -s ${temp} ]];
	then
	  cp -f ${temp} ${JSON}	
	fi
	# update github rep
	gitdir="${GIT_REP}${DIR:$DLENGTH}"
	mkdir -p $gitdir
	
	echo "befor-: ${FILE}"
	#FILE="${FILE// /\\ }"
	#FILE="${FILE//^/\\^}"
	echo "after-: ${FILE}"
	tofile="${gitdir}${FILE}"
	fromfile="${DIR}${FILE}"
	
	echo "from-: ${fromfile}"
	echo "to-: ${tofile}"
	cd  $GIT_REP
	git pull
	cp -f ${fromfile} ${tofile}
	git add -A
	git commit -m "do_up"
	git push
	fi
elif [[ $EVENT == "MODIFY" ]]; then
	if [[ $FILE == *.md ]];then
        markdown2html-converter -f "${DIR}${FILE}" -o "${NEWDIR}${NEWFILE}"
	INDEX="${NEWDIR:22}"
        INDEX="${INDEX////\".\"}"
        INDEX="${INDEX:1}"
        JSONKEY="${NEWFILE/%.md/_html}"
        JSONKEY="${JSONKEY//./_}\""
	JSONKEY="${JSONKEY// /--}"
        UPDATE_TSTR=".\"update_time\""
        INDEX="${INDEX}${JSONKEY}${UPDATE_TSTR}"
        VALUE="\"${curday}\""
        echo "index-: ${INDEX}"
        echo "value-: ${VALUE}"
        JQS="${INDEX}|=${VALUE}"
        #echo "JQS-: ${JQS}"
        cat $JSON | jq ''${JQS}'' > $temp
        if [[ -s ${temp} ]];then  # if file is not null
                cp -f $temp $JSON
        fi
	# update github rep
        gitdir="${GIT_REP}${DIR:${DLENGTH}}"
        mkdir -p $gitdir
	
	echo "befor-: ${FILE}"
        #FILE="${FILE// /\\ }"
        #FILE="${FILE//^/\\^}"
        echo "after-: ${FILE}"
        tofile="${gitdir}${FILE}"
        fromfile="${DIR}${FILE}"
        
        echo "from-: ${fromfile}"
        echo "to-: ${tofile}"
	

        cd  $GIT_REP
	git pull
        cp -f "${fromfile}" "${tofile}"
        git add -A
        git commit -m "do_up"
        git push

	fi
elif [[ $EVENT == "DELETE" ]];then
	if [[ $FILE == *.md ]];then
	rm -rf "${NEWDIR}${NEWFILE}"
	INDEX="${NEWDIR:22}"
        INDEX="${INDEX////\".\"}"   # .note. -> "."note"."
        INDEX="${INDEX:1}"   # "."note"."  -> ."note"."
        JSONKEY="${FILE/%.md/_html}"
        JSONKEY="${JSONKEY//./_}\""  # article_html -> artcile_html"
	JSONKEY="${JSONKEY// /--}"
	INDEX="${INDEX}${JSONKEY}"
	JQS="del(${INDEX})"
        cat $JSON | jq ''${JQS}'' > $temp
        if [[ -s ${temp} ]];then  # if file is not null
                cp -f $temp $JSON
	fi

	# update github rep
        gitdir="${GIT_REP}${DIR:${DLENGTH}}"
	#FILE="${FILE// /\\ }"
        tofile=${gitdir}${FILE}
        fromfile=${DIR}${FILE}
        cd  $GIT_REP
        git pull

	#SALVEIFS=$IFS
	#IFS=$(echo -en "\n\b")
        rm -rf "${tofile}"
	git add -A
        git commit -m "do_up"
        git push

	#IFS=$SAVEIFS
	fi
fi

done

